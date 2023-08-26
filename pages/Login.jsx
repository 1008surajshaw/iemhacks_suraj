import loginImg from "../assets/Images/boycode.jpg"
import Template from "../components/core/Auth/Template"

export default function login ()  {
  return (
    <Template
    title="welcome back"
    formType="login"
    description1="Build skills for today, tomorrow, and beyond."
    description2="Education to future-proof your career."
    image={loginImg}
    >

    </Template>
  )
}
