import { google } from 'googleapis'
import fetch from 'node-fetch'

export const getAnalyticsData = async (req, res, next) => {
  try {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

    if (!propertyId || !refreshToken) {
      return res.status(400).json({
        message: 'Google Analytics not fully configured. Please add GOOGLE_ANALYTICS_PROPERTY_ID and GOOGLE_REFRESH_TOKEN to environment variables.',
        error: 'GA_NOT_CONFIGURED'
      })
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    oauth2Client.setCredentials({ refresh_token: refreshToken })
    const { credentials } = await oauth2Client.refreshAccessToken()
    const accessToken = credentials.access_token

    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const formatDate = (date) => date.toISOString().split('T')[0]

    const apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`

    const makeRequest = async (body) => {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      if (!response.ok) throw new Error(`GA API error: ${response.statusText}`)
      return response.json()
    }

    // Fetch 30-day overview metrics
    const overviewResponse = await makeRequest({
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
    const dailyResponse = await makeRequest({
      dateRanges: [{ startDate: formatDate(thirtyDaysAgo), endDate: formatDate(today) }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' }
      ],
      dimensions: [{ name: 'date' }]
    })

    // Fetch top pages
    const pagesResponse = await makeRequest({
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
    const sourcesResponse = await makeRequest({
      dateRanges: [{ startDate: formatDate(thirtyDaysAgo), endDate: formatDate(today) }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
    })

    // Fetch device categories
    const deviceResponse = await makeRequest({
      dateRanges: [{ startDate: formatDate(thirtyDaysAgo), endDate: formatDate(today) }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'deviceCategory' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
    })

    const summary = overviewResponse.rows?.[0]?.metricValues || []
    const usersOverTime = (dailyResponse.rows || []).map(row => ({
      date: row.dimensionValues?.[0]?.value,
      users: parseInt(row.metricValues?.[0]?.value || 0),
      sessions: parseInt(row.metricValues?.[1]?.value || 0),
      pageViews: parseInt(row.metricValues?.[2]?.value || 0)
    }))

    const topPages = (pagesResponse.rows || []).map(row => ({
      page: row.dimensionValues?.[0]?.value,
      pageViews: parseInt(row.metricValues?.[0]?.value || 0),
      users: parseInt(row.metricValues?.[1]?.value || 0),
      avgTime: row.metricValues?.[2]?.value || '0'
    }))

    const sourcesRows = sourcesResponse.rows || []
    const trafficSources = sourcesRows.map(row => {
      const sessions = parseInt(row.metricValues?.[0]?.value || 0)
      const totalSessions = sourcesRows.reduce((sum, r) => sum + parseInt(r.metricValues?.[0]?.value || 0), 0) || 1
      return {
        name: row.dimensionValues?.[0]?.value,
        value: sessions,
        percentage: ((sessions / totalSessions) * 100).toFixed(1)
      }
    })

    const deviceRows = deviceResponse.rows || []
    const deviceCategories = deviceRows.map(row => {
      const sessions = parseInt(row.metricValues?.[0]?.value || 0)
      const totalSessions = deviceRows.reduce((sum, r) => sum + parseInt(r.metricValues?.[0]?.value || 0), 0) || 1
      return {
        device: row.dimensionValues?.[0]?.value,
        sessions,
        percentage: ((sessions / totalSessions) * 100).toFixed(1)
      }
    })

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
      configured: true
    })
  } catch (err) {
    next(err)
  }
}
