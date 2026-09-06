

export const Loader = () => {
  return (
    <div 
    className="fixed inset-0 bg-white z-[999]  !flex !flex-col !justify-center !items-center"
    >
    {/* <div
     className="w-12 h-12 rounded-full animate-spin border-2 border-dashed border-indigo-500 border-t-transparent"
     /> */}
     <div
      className="w-12 h-12  md:h-16 md:w-16 sm:w-20 sm:h-20
       rounded-full !border-2 !border-dashed 
      !border-indigo-500 border-t-[transparent] animate-spin"
      />
    </div>
  )
}

export default Loader;
