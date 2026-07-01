const express = require('express');
const router = express.Router();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const requireAuth = require('../middleware/requireAuth');

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

const CHANNEL_COLORS = {
  'Organic Search':  '#10B981',
  'Direct':          '#7C3AED',
  'Organic Social':  '#60A5FA',
  'Referral':        '#F59E0B',
  'Paid Search':     '#EC4899',
  'Email':           '#EF4444',
  'Unassigned':      '#6B7280',
};

function getClient() {
  const raw = process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GA4_SERVICE_ACCOUNT_JSON is not configured');
  return new BetaAnalyticsDataClient({ credentials: JSON.parse(raw) });
}

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const client = getClient();

    const [summaryRes, sourcesRes, dailyRes] = await Promise.all([
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
      }),
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
      }),
    ]);

    const summaryRow = summaryRes[0]?.rows?.[0];
    const summary = {
      users:     parseInt(summaryRow?.metricValues?.[0]?.value || 0),
      sessions:  parseInt(summaryRow?.metricValues?.[1]?.value || 0),
      pageViews: parseInt(summaryRow?.metricValues?.[2]?.value || 0),
    };

    const totalSessions = (sourcesRes[0]?.rows || [])
      .reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0) || 1;

    const sources = (sourcesRes[0]?.rows || []).map(row => ({
      channel:  row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
      pct:      Math.round((parseInt(row.metricValues[0].value) / totalSessions) * 100),
      color:    CHANNEL_COLORS[row.dimensionValues[0].value] || '#6B7280',
    }));

    // date is YYYYMMDD — format to "Mon DD"
    const daily = (dailyRes[0]?.rows || []).map(row => {
      const d = row.dimensionValues[0].value;
      const date = new Date(`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`);
      return {
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: parseInt(row.metricValues[0].value),
      };
    });

    res.json({ summary, sources, daily });
  } catch (err) {
    // Surface config errors clearly without leaking stack traces
    if (err.message.includes('not configured') || err.message.includes('credentials')) {
      return res.status(503).json({ error: 'Analytics not configured', unconfigured: true });
    }
    next(err);
  }
});

module.exports = router;
