import Navbar from "../components/commons/Navbar"
import Banner from "../components/Banner"
import ClassList from "../components/ClassList"
import Footer from "../components/commons/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen w-full font-[Inter]">

      <div className="page">
        <Navbar />
        <Banner />
      </div>

      <div className="page w-[1425px] bg-white">
        <ClassList />
      </div>

      <div className="page">
        <Footer />
      </div>

    </div>
  )
}
