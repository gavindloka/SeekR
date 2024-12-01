import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";


const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>LoginPage</div>
      <Button onClick={() => navigate("/register")}>Register Page</Button>
    </>
  );
};

export default LoginPage;
