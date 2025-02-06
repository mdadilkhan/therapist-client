import FacePic from '../../assets/FacePic.svg';

const TherapistList = ({ therapists, onSelectTherapist }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-lg">Live Therapist</h3>
      {therapists.map((therapist) => (
        <div
          key={therapist.id}
          className="flex items-center p-3 rounded-md my-2 shadow-sm"
        >
          {/* Image Wrapper with Status Dot */}
          <div className="relative w-[7.6rem] h-[7.6rem] border border-[#9C81CC] border-solid rounded-full">
            <img
              src={FacePic}
              alt="Therapist"
              className="w-full h-full rounded-full "
            />
            {/* Status Dot */}
            <span
              className={`absolute top-[55px] right-1 w-4 h-4 border-2 border-white rounded-full ${
                therapist.available ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>

          <div className="ml-4 flex-grow">
            <h4 className="font-semibold">{therapist.name}</h4>
            <p className="text-sm text-gray-500">{therapist.specialization}</p>
          </div>

          {/* Status Indicator */}
          <div className="flex flex-col items-center justify-center gap-4">
            <button
              className={`mt-2 w-[9rem] py-2 rounded-md ${
                therapist.available
                  ? "border border-[#614298] text-[#614298] cursor-pointer bg-white"
                  : "cursor-not-allowed border border-solid border-[#E83F40] text-[#E83F40]"
              }`}
              onClick={() => onSelectTherapist(therapist)}
              disabled={!therapist.available}
            >
              {therapist.available ? "Chat Now" : "Busy"}
            </button>
            <p className="text-sm font-bold">{therapist.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TherapistList;
