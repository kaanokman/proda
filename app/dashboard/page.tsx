import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import Leads from "@/components/Leads";
import { Row, Col, Spinner } from "react-bootstrap";
import AddItem from "@/components/add-item";

async function getLeads() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data, error } = await supabase
    .from("leads")
    .select("id, organization, firstName, lastName, title, employees, rank")
    .eq("user_id", user.id)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error loading leads:", error.message);
    return [];
  }

  return data ?? [];
}

async function LeadsPage() {
  const leads = await getLeads();
  return <Leads leadProps={leads} />;
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-3">
      <Row>
        <Col xs sm="auto" className="text-3xl font-semibold">Leads</Col>
        <Col xs="auto"><AddItem /></Col>
      </Row>

      <Row>
        <Col>
          <Suspense fallback={<Spinner />}>
            <LeadsPage />
          </Suspense>
        </Col>
      </Row>
    </div>
  );
}
