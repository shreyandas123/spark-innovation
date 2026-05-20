import { BetaAnalyticsDataClient } from '@google-analytics/data'

export const getAnalyticsData = async (req, res, next) => {
  try {
    const measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID
    const credentialsJson = process.env.GOOGLE_ANALYTICS_CREDENTIALS

    if (!measurementId || !propertyId || !credentialsJson) {
      return res.status(400).json({
        message: 'Google Analytics not fully configured. Please add GOOGLE_ANALYTICS_MEASUREMENT_ID, GOOGLE_ANALYTICS_PROPERTY_ID, and GOOGLE_ANALYTICS_CREDENTIALS to environment variables.',
        error: 'GA_NOT_CONFIGURED'
      })
    }

    const credentials = JSON.parse(credentialsJson)
    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials })

    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const formatDate = (date) => date.toISOString().split('T')[0]

    // Fetch 30-day overview metrics
    const [overviewResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: formatDate(thirtyDaysAgo), endDate: formatDate(today) }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'userConversionRate' }
      ]
    })

    // Fetch daily data for chart
    const [dailyResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: formatDate(thirtyDaysAgo), endDate: formatDate(today) }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' }
      ],
      dimensions: [{ name: 'date' }]
    })

    // Fetch top pages
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: formatDate(thirtyDaysAgo), endDate: formatDate(today) }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'averageSessionDuration' }
      ],
      dimensions: [{ name: 'pagePath' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5
    })

    // Fetch traffic sources
    const [sourcesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: formatDate(thirtyDaysAgo), endDate: formatDate(today) }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
    })

    // Fetch device categories
    const [deviceResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: formatDate(thirtyDaysAgo), endDate: formatDate(today) }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'deviceCategory' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
    })

    const summary = overviewResponse.rows?.[0]?.metricValues || []
    const usersOverTime = dailyResponse.rows?.map(row => ({
      date: row.dimensionValues?.[0]?.value,
      users: parseInt(row.metricValues?.[0]?.value || 0),
      sessions: parseInt(row.metricValues?.[1]?.value || 0),
      pageViews: parseInt(row.metricValues?.[2]?.value || 0)
    })) || []

    const topPages = pagesResponse.rows?.map(row => ({
      page: row.dimensionValues?.[0]?.value,
      pageViews: parseInt(row.metricValues?.[0]?.value || 0),
      users: parseInt(row.metricValues?.[1]?.value || 0),
      avgTime: row.metricValues?.[2]?.value || '0'
    })) || []

    const trafficSources = sourcesResponse.rows?.map(row => {
      const sessions = parseInt(row.metricValues?.[0]?.value || 0)
      const totalSessions = sourcesResponse.rows?.reduce((sum, r) => sum + parseInt(r.metricValues?.[0]?.value || 0), 0) || 1
      return {
        name: row.dimensionValues?.[0]?.value,
        value: sessions,
        percentage: ((sessions / totalSessions) * 100).toFixed(1)
      }
    }) || []

    const deviceCategories = deviceResponse.rows?.map(row => {
      const sessions = parseInt(row.metricValues?.[0]?.value || 0)
      const totalSessions = deviceResponse.rows?.reduce((sum, r) => sum + parseInt(r.metricValues?.[0]?.value || 0), 0) || 1
      return {
        device: row.dimensionValues?.[0]?.value,
        sessions,
        percentage: ((sessions / totalSessions) * 100).toFixed(1)
      }
    }) || []

    res.json({
      data: {
        summary: {
          totalUsers: parseInt(summary[0]?.value || 0),
          totalSessions: parseInt(summary[1]?.value || 0),
          totalPageViews: parseInt(summary[2]?.value || 0),
          bounceRate: parseFloat(summary[3]?.value || 0).toFixed(1),
          conversionRate: parseFloat(summary[4]?.value || 0).toFixed(1)
        },
        usersOverTime,
        topPages,
        trafficSources,
        deviceCategories
      },
      configured: true,
      measurementId
    })
  } catch (err) {
    next(err)
  }
}
