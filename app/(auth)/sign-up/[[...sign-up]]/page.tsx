import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div className="w-full my-20 flex justify-center items-center">
      <SignUp fallbackRedirectUrl={'/'} />
    </div>
  );
};

export default SignUpPage;
