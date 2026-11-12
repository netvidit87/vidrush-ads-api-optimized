/**
 * GET /api/ad_type
 * Ads API sendiri (mirip ads-api.videy.co)
 *
 * Query params (opsional):
 *   - uploader  (string)
 *   - width     (number)
 *   - ad_group  (number 1-100)
 *
 * Response:
 * {
 *   "type": "exo",
 *   "code": "",
 *   "banner_300x250": "<script>...</script>..."
 * }
 *
 * Strategi:
 * - Selalu inject popunder (ahuramazda)
 * - + 1 banner display (rotasi antara 2 banner biomanos berdasarkan ad_group)
 * - Semua dari API → tidak ada hardcoded di player
 */

const POPUNDER = `<script data-cfasync="false" src="https://ahuramazda.org/1/d4b3da13003ae6d27d4378a79cb4332d"></script>`

const BANNERS = [
  // Banner 1 – classic 300x250 (atOptions)
  `<script>
  atOptions = {
    'key' : 'e3390cf0a8cdf953ded85bdaaf3046a5',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://biomanos.org/22/e3390cf0a8cdf953ded85bdaaf3046a5"></script>`,

  // Banner 2 – container style
  `<script async="async" data-cfasync="false" src="https://biomanos.org/21/d3e082d534e1581e0f78d3cfe456f0d9"></script>
<div id="container-d3e082d534e1581e0f78d3cfe456f0d9"></div>`,
]

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Content-Type': 'application/json; charset=utf-8',
    // Cache 5 menit (iklan jarang diganti)
    'Cache-Control': 'public, max-age=300, s-maxage=300',
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function onRequestGet({ request }) {
  try {
    const url = new URL(request.url)
    const adGroupParam = url.searchParams.get('ad_group')

    // Pilih banner secara stabil berdasarkan ad_group
    let bannerIndex = 0
    if (adGroupParam) {
      const n = parseInt(adGroupParam, 10)
      if (!Number.isNaN(n) && n > 0) {
        bannerIndex = (n - 1) % BANNERS.length
      }
    } else {
      bannerIndex = Math.floor(Math.random() * BANNERS.length)
    }

    // Gabungkan: popunder + banner terpilih
    // Semua iklan hanya dari API
    const banner_300x250 = POPUNDER + '\n' + BANNERS[bannerIndex]

    const body = {
      type: 'exo',
      code: '',
      banner_300x250,
    }

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: corsHeaders(),
    })
  } catch (err) {
    // Fallback aman (hanya popunder)
    return new Response(
      JSON.stringify({
        type: 'exo',
        code: '',
        banner_300x250: POPUNDER,
      }),
      { status: 200, headers: corsHeaders() }
    )
  }
}
