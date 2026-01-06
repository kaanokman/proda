"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

type LeadsModalProps = {
  item?: {
    id: number;
    organization?: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    employees?: string;
    rank?: number;
  },
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

type FormDataType = {
  organization?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  employees?: string;
  rank?: number;
};

const toastSettings = {
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

export default function LeadsModal(props: LeadsModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm({ defaultValues: props.item, shouldFocusError: false });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    props.setShow(false);
    reset();
    setLoading(false);
  };

  useEffect(() => {
    if (props.show) {
      reset(props.item);
    }
  }, [props.show, reset])

  async function handleRequest(formData: FormDataType) {
    setLoading(true);
    try {
      const result = await fetch("/api/leads", {
        method: props.item ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...(props.item ? { id: props.item.id } : {}),
        })
      });
      const { message, error } = await result.json();
      if (message) {
        handleClose();
        router.refresh();
        toast.success(`${props.item ? 'Updated' : 'Created'} lead`, toastSettings);
      } else if (error) {
        toast.error(`Error ${props.item ? 'updating' : 'creating'} lead`, toastSettings);
      }
    } catch (error) {
      let errorMsg;
      if (error instanceof Error) errorMsg = error.message;
      toast.error(errorMsg || 'Error creating/updating lead', toastSettings);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal show={props.show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit(handleRequest)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {`${props.item ? 'Edit' : 'Add'} lead`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3 p-4 pt-3">
          {/* Company */}
          <Form.Group>
            <Form.Label className='mb-1'>Company</Form.Label>
            <Form.Control
              disabled={loading}
              type="text"
              {...register("organization", { required: 'Company is required' })}
              isInvalid={!!errors.organization}
            />
            <Form.Control.Feedback type="invalid" className='position-absolute text-xs mt-0'>
              {errors.organization?.message && String(errors.organization.message)}
            </Form.Control.Feedback>
          </Form.Group>
          {/* First Name */}
          <Form.Group>
            <Form.Label className='mb-1'>First Name</Form.Label>
            <Form.Control
              disabled={loading}
              type="text"
              {...register("firstName")}
            />
          </Form.Group>
          {/* Last Name */}
          <Form.Group>
            <Form.Label className='mb-1'>Last Name</Form.Label>
            <Form.Control
              disabled={loading}
              type="text"
              {...register("lastName")}
            />
          </Form.Group>
          {/* Title */}
          <Form.Group>
            <Form.Label className='mb-1'>Title</Form.Label>
            <Form.Control
              disabled={loading}
              type="text"
              {...register("title")}
            />
          </Form.Group>
          {/* Employees */}
          <Form.Group>
            <Form.Label className='mb-1'>Employees</Form.Label>
            <Form.Select
              disabled={loading}
              {...register("employees")}
            >
              <option value={""}>Select...</option>
              <option value={"2-10"}>2-10</option>
              <option value={"11-50"}>11-50</option>
              <option value={"51-200"}>51-200</option>
              <option value={"201-1000"}>201-1000</option>
              <option value={"1001+"}>1001+</option>
            </Form.Select>
          </Form.Group>
          {/* Rank */}
          <Form.Group>
            <Form.Label className='mb-1'>Rank</Form.Label>
            <Form.Control
              disabled={loading}
              type="number"
              {...register("rank", { valueAsNumber: true })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading} style={{ width: 80 }}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} style={{ width: 80 }}>
            {loading ? <Spinner size='sm' /> : 'Submit'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal >
  );
}
