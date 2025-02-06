import NotLive from "../../assets/NotLive.svg"

const EmptyState = () => {
    return (
      <div className="text-center">
        <img src={NotLive} alt="No Live" className="mx-auto mb-4" />
        <h3 className="text-lg font-bold">You're Not Live Yet</h3>
        <p className="text-gray-500">To start receiving live chat requests, please activate the live chat.</p>
      </div>
    );
  };
  
  export default EmptyState;
  