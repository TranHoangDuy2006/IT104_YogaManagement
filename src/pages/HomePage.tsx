import Navbar from "../components/commons/Navbar"
import Banner from "../components/Banner"
import ClassList from "../components/ClassList"
import Footer from "../components/commons/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen w-full font-[inter] bg-gray-50 select-none flex flex-col">
      <div className="w-full">
        <Navbar showPracticeSchedule={true} showUser={true} showHomePage={false} />
        <Banner />
      </div>
      <div className="flex-1 w-full bg-white flex justify-center px-2 md:px-6 lg:px-0">
        <ClassList />
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  )
}
