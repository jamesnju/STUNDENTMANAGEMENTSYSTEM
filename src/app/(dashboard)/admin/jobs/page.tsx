"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAvailableJobs, useJobHistory, useRunJob } from "@/hooks/useJobs";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { 
  Loader2, 
  Play, 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  X 
} from "lucide-react";

// Map job names to readable titles and default payloads
const JOB_META: Record<string, { title: string; description: string; defaultPayload: any }> = {
  sendPendingNotifications: {
    title: "Send Pending Notifications",
    description: "Dispatches queued emails and in-app notifications.",
    defaultPayload: { limit: 50, recipientLimit: 200 },
  },
  sendAssessmentReminders: {
    title: "Send Assessment Reminders",
    description: "Notifies students/parents of upcoming assessments.",
    defaultPayload: { windowHours: 12 },
  },
  markOverdueAssignments: {
    title: "Mark Overdue Assignments",
    description: "Closes assignments that have passed their due date.",
    defaultPayload: { limit: 1000 },
  },
  generateDailyDigest: {
    title: "Generate Daily Digest",
    description: "Builds and sends daily summary emails to staff and parents.",
    defaultPayload: { forDate: new Date().toISOString() },
  },
  cleanupExpiredRefreshTokens: {
    title: "Cleanup Expired Tokens",
    description: "Removes expired and revoked JWT refresh tokens from the DB.",
    defaultPayload: { revokedRetentionDays: 7, maxDeletes: 5000 },
  },
};

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data: jobList, isLoading: loadingJobs } = useAvailableJobs();
  const { data: historyData, isLoading: loadingHistory } = useJobHistory({ page, limit: 10 });
  const { mutate: runJob, isPending: isRunning } = useRunJob();

  // Modal State
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [payloadString, setPayloadString] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const openRunModal = (jobName: string) => {
    setSelectedJob(jobName);
    setPayloadString(JSON.stringify(JOB_META[jobName]?.defaultPayload || {}, null, 2));
    setJsonError(null);
  };

  const handleRunJob = () => {
    if (!selectedJob) return;
    setJsonError(null);

    let payload;
    try {
      payload = JSON.parse(payloadString);
    } catch (err) {
      setJsonError("Invalid JSON format. Please check your syntax.");
      return;
    }

    runJob({ jobName: selectedJob, payload }, {
      onSuccess: (res: any) => {
        setSelectedJob(null);
        alert(`Job ${selectedJob} completed in ${res.durationMs}ms.\n\nResult:\n${JSON.stringify(res.result, null, 2)}`);
      },
      onError: (err: any) => {
        alert(err.response?.data?.error?.message || "Failed to run job.");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
          <Terminal className="h-6 w-6 text-[var(--brand)]" /> Background Jobs
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">Trigger cron tasks and view their execution history.</p>
      </div>

      {/* Available Jobs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loadingJobs ? (
          <div className="col-span-full flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" />
          </div>
        ) : !jobList || jobList.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center text-[var(--fg-muted)]">
            No jobs available. (Check the API connection).
          </div>
        ) : (
          jobList.map((jobName: string) => {
            const meta = JOB_META[jobName] || { title: jobName, description: "Custom background task.", defaultPayload: {} };
            return (
              <div key={jobName} className="flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-sm hover:border-[var(--brand)] transition-colors">
                <div>
                  <h3 className="font-bold text-[var(--fg-base)]">{meta.title}</h3>
                  <p className="text-xs text-[var(--fg-muted)] mt-1 mb-4">{meta.description}</p>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => openRunModal(jobName)}>
                  <Play className="mr-2 h-4 w-4" /> Run Job
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* History Table */}
      <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
          <History className="h-5 w-5 text-[var(--fg-muted)]" /> Execution History
        </h2>

        {loadingHistory ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" />
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Job Name</TH>
                <TH>Status</TH>
                <TH>Duration</TH>
                <TH>Triggered At</TH>
                <TH>Result Summary</TH>
              </TR>
            </THead>
            <TBody>
              {historyData?.data.length === 0 && (
                <TR><TD colSpan={5} className="py-12 text-center text-[var(--fg-muted)]">No job history found.</TD></TR>
              )}
              {historyData?.data.map((run: any) => (
                <TR key={run.id}>
                  <TD className="font-mono text-sm">{run.jobName}</TD>
                  <TD>
                    <Badge variant={run.status === "SUCCESS" ? "success" : "danger"}>
                      <span className="flex items-center gap-1">
                        {run.status === "SUCCESS" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {run.status}
                      </span>
                    </Badge>
                  </TD>
                  <TD>
                    <span className="flex items-center gap-1 text-[var(--fg-muted)] text-sm">
                      <Clock className="h-3 w-3" /> {run.durationMs}ms
                    </span>
                  </TD>
                  <TD className="text-sm text-[var(--fg-muted)]">
                    {new Date(run.createdAt).toLocaleString()}
                  </TD>
                  <TD>
                    <pre className="text-xs bg-[var(--bg-muted)] p-2 rounded max-w-sm overflow-x-auto text-[var(--fg-base)]">
                      {JSON.stringify(run.result?.summary || run.result, null, 2)}
                    </pre>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}

        {/* Pagination */}
        {historyData?.meta && historyData.meta.total > historyData.meta.limit && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-[var(--fg-muted)]">
              Page {historyData.meta.page} of {Math.ceil(historyData.meta.total / historyData.meta.limit)}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page <= 1} onClick={() => {
                const p = new URLSearchParams(searchParams.toString());
                p.set("page", (page - 1).toString());
                router.push(`/admin/jobs?${p.toString()}`);
              }}>Previous</Button>
              <Button variant="secondary" disabled={page >= Math.ceil(historyData.meta.total / historyData.meta.limit)} onClick={() => {
                const p = new URLSearchParams(searchParams.toString());
                p.set("page", (page + 1).toString());
                router.push(`/admin/jobs?${p.toString()}`);
              }}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Trigger Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] p-4">
              <h2 className="text-lg font-bold text-[var(--fg-base)]">
                Run Job: {JOB_META[selectedJob]?.title || selectedJob}
              </h2>
              <button onClick={() => setSelectedJob(null)} className="rounded p-1 hover:bg-[var(--bg-muted)] text-[var(--fg-muted)] hover:text-[var(--fg-base)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-sm text-[var(--fg-muted)]">
                Review or modify the JSON payload below before execution.
              </p>
              
              {jsonError && <div className="p-2 bg-red-100 text-red-800 text-sm rounded">{jsonError}</div>}

              <textarea 
                className="w-full h-40 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] p-3 text-sm font-mono text-[var(--fg-base)] focus:ring-2 focus:ring-[var(--ring)] focus:outline-none"
                value={payloadString}
                onChange={(e) => setPayloadString(e.target.value)}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <Button type="button" variant="secondary" onClick={() => setSelectedJob(null)}>Cancel</Button>
                <Button type="button" onClick={handleRunJob} loading={isRunning}>
                  <Play className="mr-2 h-4 w-4" /> Execute Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminJobsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" />
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}