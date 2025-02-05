import { ClipLoader } from 'react-spinners';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <ClipLoader color="#3B82F6" size={50} />
    </div>
  );
};

export default LoadingSpinner; 