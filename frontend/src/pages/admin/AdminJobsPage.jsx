import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, RefreshCw } from 'lucide-react'
import JobManagementTable from '../../components/admin/JobManagementTable'
import JobFormModal from '../../components/admin/JobFormModal'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import adminService from '../../services/adminService'

const JOB_CATEGORIES = [
  'Software Engineering', 'Data Science', 'Machine Learning', 'Web Development',
  'Mobile Development', 'DevOps', 'Cloud Architecture', 'Cybersecurity',
  'UI/UX Design', 'Product Management', 'Business Analyst', 'Other',
]

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  
  const [showScrapeModal, setShowScrapeModal] = useState(false)
  const [scrapeLocation, setScrapeLocation] = useState('')
  const [scrapeKeyword, setScrapeKeyword] = useState('')
  const [scrapeLimit, setScrapeLimit] = useState(5)
  const [scrapeProgress, setScrapeProgress] = useState(null)
  const [scrapeLoading, setScrapeLoading] = useState(false)
  const [scrapeResult, setScrapeResult] = useState(null)

  const fetchJobs = useCallback(async (page = 1, searchVal, category) => {
    try {
      setLoading(true)
      const params = { page, limit: 10 }
      if (searchVal !== undefined ? searchVal : search) params.search = searchVal !== undefined ? searchVal : search
      if (category !== undefined ? category : categoryFilter) params.category = category !== undefined ? category : categoryFilter

      const res = await adminService.getJobs(params)
      const data = res.data?.data || res.data
      setJobs(data?.jobs || data?.data || [])
      setPagination((prev) => ({
        ...prev,
        page: data?.page || page,
        total: data?.total || 0,
        totalPages: data?.totalPages || 0,
      }))
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }, [search, categoryFilter])

  useEffect(() => {
    fetchJobs(1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    const val = e.target.value
    setSearch(val)
    const timeout = setTimeout(() => fetchJobs(1, val), 400)
    return () => clearTimeout(timeout)
  }

  const handleCategoryFilter = (e) => {
    const val = e.target.value
    setCategoryFilter(val)
    fetchJobs(1, undefined, val)
  }

  const handlePageChange = (page) => {
    fetchJobs(page)
  }

  const handleSort = (key, direction) => {
    const sorted = [...jobs].sort((a, b) => {
      if (!a[key]) return 1
      if (!b[key]) return -1
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
    setJobs(sorted)
  }

  const handleDelete = async (id) => {
    try {
      await adminService.deleteJob(id)
      fetchJobs(pagination.page)
    } catch (err) {
      console.error('Failed to delete job:', err)
    }
  }

  const handleSave = async (data, id) => {
    try {
      setFormLoading(true)
      if (id) {
        await adminService.updateJob(id, data)
      } else {
        await adminService.createJob(data)
      }
      setShowAddModal(false)
      setEditTarget(null)
      fetchJobs(pagination.page)
    } catch (err) {
      console.error('Failed to save job:', err)
    } finally {
      setFormLoading(false)
    }
  }

  const handleStopScrape = async () => {
    try {
      const res = await adminService.stopScrapeJobs()
      const data = res.data?.data || res.data
      setScrapeResult(data?.result || data)
      setScrapeProgress(null)
      setScrapeLoading(false)
      fetchJobs(1)
    } catch (err) {
      console.error('Failed to stop scraper:', err)
    }
  }

  const handleScrape = async (e) => {
    e.preventDefault()
    if (!scrapeLocation.trim()) return
    try {
      setScrapeLoading(true)
      setScrapeResult(null)
      setScrapeProgress({ scraped: 0, inserted: 0, failed: 0, currentSearch: '', currentLoc: '' })
      
      const payload = {
        location: scrapeLocation,
        limit: parseInt(scrapeLimit) || 5,
        keyword: scrapeKeyword || undefined
      }

      await adminService.scrapeJobs(payload)
      
      // Start status polling
      const interval = setInterval(async () => {
        try {
          const statusRes = await adminService.getScrapeStatus()
          const statusData = statusRes.data?.data || statusRes.data
          
          if (statusData) {
            setScrapeProgress(statusData.progress)
            if (!statusData.active) {
              clearInterval(interval)
              setScrapeResult(statusData.result || { success: true })
              setScrapeLoading(false)
              fetchJobs(1)
            }
          }
        } catch (pollErr) {
          console.error('Polling status failed:', pollErr)
          clearInterval(interval)
          setScrapeLoading(false)
        }
      }, 1500)

    } catch (err) {
      console.error('Scraping failed:', err)
      setScrapeResult({ error: err.message || 'Failed to execute scraper.' })
      setScrapeLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Job</span> Management
          </h1>
          <p className="text-gray-400">Manage job postings and opportunities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => {
            setShowScrapeModal(true)
            setScrapeResult(null)
            setScrapeLocation('')
          }}>
            <RefreshCw className="w-4 h-4 mr-2" /> Scrap Jobs
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Job
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-full sm:w-48 transition-all duration-200"
          >
            <option value="">All Categories</option>
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] overflow-hidden">
        <JobManagementTable
          jobs={jobs}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          onEdit={(job) => setEditTarget(job)}
          onDelete={handleDelete}
        />
      </div>

      <JobFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(data) => handleSave(data)}
        loading={formLoading}
      />

      <JobFormModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(data) => handleSave(data, editTarget?.id || editTarget?._id)}
        job={editTarget}
        loading={formLoading}
      />

      {/* Scrap Jobs Modal */}
      <Modal
        isOpen={showScrapeModal}
        onClose={() => !scrapeLoading && setShowScrapeModal(false)}
        title="Scrap Active Jobs via AI"
        size="md"
      >
        {scrapeLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-5 text-center">
            <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Scraping Active Job Postings...</h3>
              <p className="text-xs text-indigo-400 font-semibold animate-pulse">
                {scrapeProgress?.currentSearch 
                  ? `Searching "${scrapeProgress.currentSearch}" in ${scrapeProgress.currentLoc || scrapeLocation}`
                  : 'Bootstrapping scraper engine...'}
              </p>
            </div>
            
            <div className="w-full max-w-sm rounded-xl bg-white/[0.03] border border-white/5 p-4 space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Jobs Found:</span>
                <span className="font-bold text-white">{scrapeProgress?.scraped || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Successfully Scraped & Saved:</span>
                <span className="font-bold text-emerald-400">{scrapeProgress?.inserted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Skipped/Duplicates/Failed:</span>
                <span className="font-bold text-rose-400">{scrapeProgress?.failed || 0}</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 max-w-xs leading-normal">
              Scanning LinkedIn, Indeed, and Naukri API lists dynamically. This may take up to a minute.
            </p>

            <button
              onClick={handleStopScrape}
              type="button"
              className="mt-2 px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-xs font-black uppercase tracking-wider transition active:scale-95 shadow"
            >
              Stop Scraping
            </button>
          </div>
        ) : scrapeResult ? (
          <div className="space-y-4 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-white">Scraping Complete!</h3>
            {scrapeResult.error ? (
              <p className="text-sm text-rose-400">{scrapeResult.error}</p>
            ) : (
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 space-y-2 text-sm text-left max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-500">Jobs Inserted:</span>
                  <span className="font-bold text-emerald-400">{scrapeResult.inserted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Failed Records:</span>
                  <span className="font-bold text-rose-400">{scrapeResult.failed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Scraped:</span>
                  <span className="font-bold text-white">{scrapeResult.totalScraped || scrapeResult.total || 0}</span>
                </div>
                {scrapeResult.message && (
                  <p className="text-[10px] text-gray-500 italic pt-2 border-t border-white/5 text-center">
                    {scrapeResult.message}
                  </p>
                )}
              </div>
            )}
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button onClick={() => setShowScrapeModal(false)}>Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleScrape} className="space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed bg-white/[0.02] border border-white/5 p-3 rounded-xl">
              Enter target parameters. The active AI scraper will crawl major portals, clean and deduplicate matching postings, and index them immediately in the portal database.
            </p>
            
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Navi Mumbai, Pune, Bangalore"
                value={scrapeLocation}
                onChange={(e) => setScrapeLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Keyword / Field</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer (All if blank)"
                  value={scrapeKeyword}
                  onChange={(e) => setScrapeKeyword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 text-sm"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Max Pages per Scraper</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  placeholder="5 (Default)"
                  value={scrapeLimit}
                  onChange={(e) => setScrapeLimit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <Button variant="secondary" onClick={() => setShowScrapeModal(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">
                Trigger Scraper
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default AdminJobsPage
