"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  Spinner,
  Switch,
  useDisclosure,
  User,
} from "@heroui/react";
import { FaBell, FaPlusCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GiRingingBell } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useProfile } from "@/services/Profile/getProfile";
import { confirm } from "../ConfirmModal";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { HiEye } from "react-icons/hi";
import { Form, Formik } from "formik";
import { HiEyeSlash } from "react-icons/hi2";
import { loginSchema } from "@/utils/validation/AuthValidation";
import { Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useAuthStore } from "@/services/interceptor";
export interface LoginValues {
  email: string;
  password: string;
}

export default function UserDropdown() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user, isLoading, error } = useProfile();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [showPassword, setShowPassword] = useState(false);

  if (isLoading)
    return (
      <div className="flex items-center gap-3 w-fit px-2 py-1">
        <div>
          <Skeleton
            classNames={{
              base: "animate-pulse bg-gray-200 dark:bg-gray-700",
            }}
            className="w-10 h-10 rounded-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Skeleton
            classNames={{
              base: "animate-pulse bg-gray-200 dark:bg-gray-700",
            }}
            className="h-4 w-24 rounded-md"
          />
          <Skeleton
            classNames={{
              base: "animate-pulse bg-gray-200 dark:bg-gray-700",
            }}
            className="h-3 w-16 rounded-md"
          />
        </div>
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  const handleLogin = async (values: LoginValues) => {
    try {
      const res = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (res?.ok) {
        const session = await getSession();
        if (session?.accessToken) {
          setAccessToken(session.accessToken);
        }

        toast.success("ورود با موفقیت انجام شد");
        onOpenChange();
      } else {
        toast.error(res?.error || "خطا در ورود. لطفاً مجدداً تلاش کنید");
      }
    } catch (error) {
      toast.error("خطایی در ارتباط با سرور رخ داد");
    }
  };

  if (!user)
    return (
      <>
        <Button
          onPress={onOpen}
          variant="bordered"
          className="text-xl font-medium"
          color="warning"
        >
          ورود
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            <ModalHeader>ورود به حساب کاربری</ModalHeader>
            <ModalBody>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={handleLogin}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[#D27700] font-bold block text-right">
                        ایمیل
                      </label>
                      <Field
                        name="email"
                        type="email"
                        className={`w-full p-2 border-2 rounded-lg ${
                          errors.email && touched.email
                            ? "border-red-500"
                            : "border-[#CCCCCC]"
                        } dark:bg-gray-800 dark:placeholder:text-amber-100`}
                        placeholder="example@example.com"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm text-right"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#D27700] font-bold block text-right">
                        رمز عبور
                      </label>
                      <div className="relative">
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className={`w-full p-2 border-2 rounded-lg pr-10 ${
                            errors.password && touched.password
                              ? "border-red-500"
                              : "border-[#CCCCCC]"
                          } dark:bg-gray-800 dark:placeholder:text-amber-100`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                        >
                          {showPassword ? <HiEyeSlash /> : <HiEye />}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm text-right"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer mt-2 bg-gradient-to-r from-[#E89300] to-[#FFB84D] text-white py-2 rounded-xl shadow-lg hover:shadow-md transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? <Spinner size="sm" /> : "ورود"}
                    </button>
                  </Form>
                )}
              </Formik>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );

  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              color: "warning",
              src: user?.user?.profilePicture,
            }}
            className="transition-transform"
            description={user?.user?.role === "buyer" ? "خریدار" : "فروشنده"}
            name={user?.user?.firstName + " " + user?.user?.lastName}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem
            textValue="پروفایل"
            key="profile"
            className="h-14 gap-2"
          >
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                color: "primary",
                src: user?.user?.profilePicture,
              }}
              className="transition-transform"
              description={user?.user?.phoneNumber}
              name={
                user?.user?.firstName + " " + user?.user?.lastName || "Personal"
              }
            />
          </DropdownItem>

          <DropdownItem key="settings" textValue="شارژ کردن کیف پول">
            <div className="flex items-center gap-2">
              <FaPlusCircle />
              شارژ کردن کیف پول
            </div>
          </DropdownItem>
          <DropdownItem
            onPress={onOpen}
            key="team_settings"
            textValue="تنظیمات نوتیفیکیشن ها"
          >
            <div className="flex items-center gap-2">
              <FaBell />
              تنظیمات نوتیفیکیشن ها
            </div>
          </DropdownItem>
          <DropdownItem
            key="system"
            onPress={() => router.push("/buyer/profile")}
            textValue="ویرایش اطلاعات کاربری"
          >
            <div className="flex items-center gap-2">
              <FaUser />
              ویرایش اطلاعات کاربری
            </div>
          </DropdownItem>
          <DropdownItem
            textValue="خروج از حساب کاربری"
            key="logout"
            color="danger"
            onPress={async () => {
              const isConfirmed = await confirm({
                title: "آیا از خروج از حساب کاربری مطمئن هستید؟",
                description: "آیا مطمئن هستید؟",
                confirmText: "خروج",
                cancelText: "انصراف",
              });

              if (isConfirmed) {
                signOut({ redirect: false });
              }
            }}
          >
            <div className="flex items-center gap-2">
              <FaSignOutAlt />
              خروج از حساب کاربری
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        hideCloseButton
      >
        <ModalContent>
          <>
            <ModalHeader className="flex justify-between items-center gap-2  text-2xl  font-normal">
              <div className="flex items-center gap-2">
                <GiRingingBell />
                تنظیمات نوتیفیکیشن
              </div>
              <button
                className="flex items-center gap-2 border border-red-400 text-red-500 rounded-full px-6 py-2 text-lg font-bold hover:bg-red-50 transition"
                onClick={onOpenChange}
              >
                بستن <IoMdClose size={24} />
              </button>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-10 text-right border-dotted border-t-2 py-4 border-color1">
              <div className="flex items-center justify-between flex-row">
                <span className="text-xl font-normal">نوتیفیکیشن رزرو</span>
                <Switch defaultSelected color="warning" />
              </div>
              <div className="flex items-center justify-between flex-row">
                <span className="text-xl font-normal">نوتیفیکیشن پرداخت</span>
                <Switch color="warning" />
              </div>
              <div className="flex items-center justify-between flex-row">
                <span className="text-xl font-normal">نوتیفیکیشن تخفیف</span>
                <Switch defaultSelected color="warning" />
              </div>
              <div className="flex items-center justify-between flex-row">
                <span className="text-xl font-normal">نوتیفیکیشن سیستمی</span>
                <Switch defaultSelected color="warning" />
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
