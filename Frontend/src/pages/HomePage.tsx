
import { FaRegCommentAlt,FaRegSmile, FaRegQuestionCircle } from "react-icons/fa";
import CategoryCards from "../components/CategoryCards";
import InfoCard from "../components/InfoCard";
import { Link } from "react-router-dom";

interface category {
  men:string,
  women:string,
  kids:string
}

const HomePage = () => {
  const categories:category = {
     men:"Mens",
     women:"Womens",
     kids:"Kids"
  }
  
  return (
   <div className="flex flex-col mt-[70px]">
   <h1 className="text-center text-lg text-gray-700 font-medium">Choose a department</h1>
   <div className="flex flex-col sm:flex-row gap-5 items-center md:justify-center px-2 mt-[25px] h-[180px]">
     <Link to={`/products/${categories.women}`}>
         <CategoryCards department="WOMENS" image="/images/model1.jpg" />
     </Link>
     <Link to={`/products/${categories.men}`}>
         <CategoryCards department="MENS" image="/images/model2.jpg" />
     </Link>
     <Link to={`/products/${categories.kids}`}>
         <CategoryCards department="KIDS" image="/images/model3.jpg" />
     </Link>
   </div>
   <div className="md:px-5 p-2 gap-3 md:gap-5 md:flex md:justify-center  grid place-items-center  grid-cols-12  mt-[420px] sm:mt-[50px]">
     <InfoCard Icon={FaRegSmile} title="HAPPY CUSTOMERS" description="100000+ Happy Customers across India" />
     <InfoCard Icon={FaRegQuestionCircle } title="FOR ENQUIRIES" description="Mail to FARFETCH@ENQUIRE or Contact on +998756765" />
     <InfoCard Icon={FaRegCommentAlt} title="NEED HELP?" description="Contact our Global Customer Service Team" />
   </div>
 </div>
 
  )
}

export default HomePage
