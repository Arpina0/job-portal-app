import businessStartupImg from '../assets/business-startup_11.png';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row items-center justify-between h-full py-12">
        {/* Text Content */}
        <div className="text-center md:text-left md:w-2/5 space-y-6">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Find Your Next</span>
            <span className="block text-indigo-600">Career Opportunity</span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
            Connect with top employers and find the perfect job that matches your skills and aspirations.
          </p>
        </div>

        {/* Image */}
        <div className="mt-10 md:mt-0 md:w-3/5 flex justify-center items-center">
          <img
            src={businessStartupImg}
            alt="Business Startup Illustration"
            className="w-full h-auto max-w-2xl object-contain transform scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default Home; 