'use client';

import { Row, Col } from "react-bootstrap";
import Actions from "@/components/Actions";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Table from 'react-bootstrap/Table';
import { Form } from "react-bootstrap";

const toastSettings = {
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

type RentRollType = {
  id: number;
  address?: string;
  property: string;
  unit?: string;
  tenant?: string;
  lease_start?: Date;
  lease_end?: Date;
  sqft?: number;
  monthly_payment?: number;
};

const columns = ["Address", "Property", "Unit", "Tenant", "Lease Start", "Lease End", "Square Feet", "Monthly Payment"];

export default function RentRoll({ rentRoll }: { rentRoll: RentRollType[] }) {

  const [rentRollData, setRentRollData] = useState<RentRollType[]>(rentRoll);
  // const [loading, setLoading] = useState(true);

  const [filteredData, setFilteredData] = useState<RentRollType[]>(rentRoll);

  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const organizations = useMemo(() => {
    return Array.from(
      new Set(rentRollData.map(l => l.property).filter(Boolean))
    );
  }, [rentRollData]);

  const getRentRollData = async () => {
    const response = await fetch("/api/rent_roll", {
      method: "GET",
    });
    const { result, error } = await response.json();
    if (result) {
      setRentRollData(result);
    } else if (error) {
      toast.error(`Error loading rent roll data`, toastSettings);
    }
    // setLoading(false);
  }

  useEffect(() => {
    if (!selectedCompany) {
      setFilteredData(rentRollData);
    } else {
      const data = rentRollData.filter((rentRollItem) => rentRollItem.property === selectedCompany);
      setFilteredData(data);
      if (!data.length) {
        setSelectedCompany("");
      }
    }
  }, [rentRollData, selectedCompany]);

  useEffect(() => {
    // setLoading(true);
    getRentRollData();
  }, [rentRoll]);

  return (
    <div className='d-flex flex-col gap-2'>
      <Row className='justify-content-between'>
        <Col>
          <Form.Group>
            <Form.Label className='mb-1'>Property</Form.Label>
            <Form.Select
              style={{ maxWidth: '500px' }}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value={""}>All</option>
              {organizations.map((org: string) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <div
        style={{
          maxHeight: "450px",
          overflowY: "auto",
          overflowX: "hidden",
          border: "1px solid #dee2e6",
        }}
      >
        <Table
          striped
          hover
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            marginBottom: 0,
          }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              background: "white",
            }}
          >
            <tr>
              {columns.map((title) => (
                <th
                  key={title}
                  style={{
                    borderBottom: "1px solid #dee2e6",
                    borderRight: "1px solid #dee2e6",
                  }}
                >
                  {title}
                </th>
              ))}
              <th
                style={{
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ?
              <tr>
                <td colSpan={columns.length + 1} className='border-bottom-0'>
                  <div className='d-flex justify-content-center'>
                    No rent roll data
                  </div>
                </td>
              </tr> : <>
                {filteredData.map((rentRollItem, rowIndex) => {
                  const isLastRow = rowIndex === filteredData.length - 1;
                  const cells = Object.entries(rentRollItem).filter(([key]) => key !== "id");
                  return (
                    <tr key={rentRollItem.id} className={isLastRow ? 'border-bottom-0' : ''}>
                      {cells.map(([key, value]) => (
                        <td
                          key={key}
                          style={{
                            borderRight: "1px solid #dee2e6",
                            borderBottom: isLastRow ? "none" : "1px solid #dee2e6",
                          }}
                        >
                          {value ? String(value) : "-"}
                        </td>
                      ))}
                      <td
                        style={{
                          borderBottom: isLastRow ? "none" : "1px solid #dee2e6",
                        }}
                      >
                        <Actions item={rentRollItem} />
                      </td>
                    </tr>
                  );
                })}
              </>
            }
          </tbody>
        </Table>
      </div>
    </div >
  );
}
