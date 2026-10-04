"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkflowPreview } from "@/components/studio/WorkflowPreview";

const examples = [
	{ name: "New customer enquiry", workflow: "Enquiry → review", status: "Needs review" },
	{ name: "Appointment request", workflow: "Calendar → confirmation", status: "Prepared" },
	{ name: "Open quote", workflow: "Quote → follow-up", status: "Prepared" },
];

const sampleRules = [
	"Review outgoing replies before sending",
	"Flag uncertain answers for a person",
	"Prepare quote follow-up reminders",
];

export function ProductDemo() {
	const [rules, setRules] = useState([true, true, false]);

	return (
		<section className="operations-demo" aria-label="Example operations dashboard">
			<h2>A little more visibility.</h2>
			<p>Sample jobs and local controls. These settings do not affect a live system.</p>

			<Tabs defaultValue="today">
				<TabsList className="operations-tabs">
					<TabsTrigger value="today">Today</TabsTrigger>
					<TabsTrigger value="jobs">Jobs</TabsTrigger>
					<TabsTrigger value="rules">Rules</TabsTrigger>
				</TabsList>

				<TabsContent value="today">
					<WorkflowPreview />
				</TabsContent>

				<TabsContent value="jobs">
					<div className="sample-jobs" aria-label="Sample jobs">
						<table>
							<thead>
								<tr className="sample-jobs-header">
									<th scope="col">Example job</th>
									<th scope="col">Workflow</th>
									<th scope="col">Status</th>
								</tr>
							</thead>
							<tbody>
								{examples.map((job) => (
									<tr key={job.name}>
										<td>{job.name}</td>
										<td>{job.workflow}</td>
										<td>{job.status}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</TabsContent>

				<TabsContent value="rules">
					<div className="sample-rules">
						{sampleRules.map((rule, index) => (
							<div key={rule}>
								<span id={`rule-${index}`}>{rule}</span>
								<button
									type="button"
									className="rule-switch"
									role="switch"
									aria-checked={rules[index]}
									aria-labelledby={`rule-${index}`}
									onClick={() => setRules(current => current.map((value, i) => (i === index ? !value : value)))}
								>
									<span />
								</button>
							</div>
						))}
						<p role="status">{rules.filter(Boolean).length} of 3 example rules enabled. Changes stay in this demo.</p>
					</div>
				</TabsContent>
			</Tabs>
		</section>
	);
}
