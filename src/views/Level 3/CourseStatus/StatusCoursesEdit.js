import { Fragment, useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  FormFeedback,
  ModalBody,
} from "reactstrap";

import { useForm, Controller } from "react-hook-form";
import "@styles/react/libs/react-select/_react-select.scss";
import { Code } from "react-feather";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { usePutSth } from "../../../core/apiPost";
const MySwal = withReactContent(Swal);
const StatusCoursesEdit = ({data}) => {
  const [show, setShow] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { mutate } = usePutSth("/Status");
   const queryClient = useQueryClient();
 
   useEffect(() => {
     if (data) {
       reset({
        id: data.id,
        statusName: data.statusName || "",
        describe: data.describe || "",
        statusNumber: data.statusNumber || "",
       });
     }
   }, [data, reset]);
   
   const editStatus = (data) => {
 
     mutate(data, {
       onSuccess: (response) => {
         console.log("res: ", response);
 
         queryClient.invalidateQueries(["/Status"]);
         setShow(false);
 
         MySwal.fire({
           title: "عملیات موفقیت‌آمیز بود",
           text: "شبکه اجتماعی جدید با موفقیت ثبت شد",
           icon: "success",
           confirmButtonText: "باشه",
           customClass: {
             confirmButton: "btn btn-success",
           },
           buttonsStyling: false,
         });
       },
       onError: (error) => {
         MySwal.fire({
           title: "خطا در عملیات",
           text: "مشکلی در ثبت اطلاعات جدید رخ داد. لطفاً دوباره تلاش کنید.",
           icon: "error",
           confirmButtonText: "تلاش مجدد",
           customClass: {
             confirmButton: "btn btn-danger",
           },
           buttonsStyling: false,
         });
       },
     });
   };


  return (
    <Fragment>
       <Card className="mb-0 r-2">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setShow(true)}
        >
          <Code size={14} />
          <span className="align-middle font-medium-2 ms-1">ویرایش</span>
        </div>
      </Card>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>

        <ModalBody className="px-sm-5 mx-50 pb-5">
          <div className="text-center mb-2">
            <h1 className="mb-1">اطلاعات وضعیت دوره جدید را وارد کنید</h1>
          </div>
          <Row
            tag="form"
            className="gy-1 pt-75"
            onSubmit={handleSubmit(editStatus)}
          >
            <Col md={6} xs={12}>
              <Label className="form-label" for="statusName">
                نام وضعیت دوره
              </Label>
              <Controller
                control={control}
                name="statusName"
                rules={{
                  required: "نام وضعیت دوره الزامی است",
                  minLength: {
                    value: 5,
                    message: "تعداد کاراکترها نباید کمتر از 5 باشد",
                  },
                  maxLength: {
                    value: 50,
                    message: "تعداد کاراکترها نباید بیشتر از 50 باشد",
                  },
                }}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id="statusName"
                      placeholder="نام..."
                      invalid={!!errors.statusName} 
                    />
                  );
                }}
              />
              {errors.statusName && (
                <FormFeedback>{errors.statusName.message}</FormFeedback> 
              )}
            </Col>
            <Col md={6} xs={12}>
              <Label className="form-label" for="describe">
                توضیحات وضعیت
              </Label>
              <Controller
                name="describe"
                control={control}
                rules={{
                  required: "توضیحات وضعیت الزامی است",
                  minLength: {
                    value: 5,
                    message: "تعداد کاراکترها نباید کمتر از 5 باشد",
                  },
                  maxLength: {
                    value: 50,
                    message: "تعداد کاراکترها نباید بیشتر از 50 باشد",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="describe"
                    placeholder="توضیحات وضعیت..."
                    invalid={!!errors.describe}
                  />
                )}
              />
              {errors.describe && (
                <FormFeedback>{errors.describe.message}</FormFeedback> 
              )}
            </Col>
            <Col md={12} xs={12}>
              <Label className="form-label" for="statusNumber">
                شناسه
              </Label>
              <Controller
                name="statusNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="statusNumber"
                    placeholder="توضیحات وضعیت..."
                    invalid={!!errors.statusNumber}
                  />
                )}
              />
              {errors.statusNumber && (
                <FormFeedback>{errors.statusNumber.message}</FormFeedback> 
              )}
            </Col>
            <Col xs={12} className="text-center mt-2 pt-50">
              <Button type="submit" className="me-1" color="primary">
                ثبت
              </Button>
              <Button
                type="reset"
                color="secondary"
                outline
                onClick={() => setShow(false)}
              >
                انصراف
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default StatusCoursesEdit;
