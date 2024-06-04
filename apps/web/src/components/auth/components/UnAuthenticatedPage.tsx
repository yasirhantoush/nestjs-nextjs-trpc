import Link from "next/link";
import { Button } from "../../ui/button";

export const UnAuthenticatedPage = () => {
  return (
    <>
      <div className='flex flex-col justify-center items-center gap-4 mt-16'>
        الرجاء تسجيل  الدخول:
        <Button asChild>
          <Link href={`/auth/login`} onClick={() => { window.localStorage.setItem('afterLogin', window.location.href); }} className='w-full md:w-1/2 btn-sm mt-2 btn btn-primary'>
            تسجيل دخول
          </Link>
        </Button>
      </div>
    </>
  );
};
