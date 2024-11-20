

interface props {
    department:string,
    image:string
}

const DepartmentCards = ({department,image}:props) => {
  return (
    <div className="relative h-full">
      <img
        className="object-cover h-[200px]"
        src={image}
        alt="Loading ..."
        width="350px"
      />
      <h2 className="text-2xl font-bold text-white absolute flex justify-center items-center inset-0">
         {department+"WEAR"}
      </h2>
    </div>
  );
};

export default DepartmentCards;
