import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <div className="w-full my-20 flex justify-center items-center">
      <SignIn fallbackRedirectUrl={'/'} />
    </div>
  );
};

export default SignInPage;
