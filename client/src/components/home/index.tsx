import HeroArea from './HeroArea'
import BrandArea from './BrandArea'
import AboutArea from './AboutArea'
import ServiceArea from './ServiceArea' 
import PortfolioArea from './PortfolioArea'
import TestimonoalArea from './TestimonoalArea'
import BlogArea from './BlogArea'
import ContactArea from './ContactArea' 
import LostVehicleReport from './LostVehicleReport'
import ModelTestArea from './ModelTestArea'
import HeaderOne from '../../layouts/headers/HeaderOne'
import FooterOne from '../../layouts/footers/FooterOne'
import ScrollTop from '../common/ScrollTop'
import CustomCursor from '../common/CustomCursor'
import ScrollToTop from '../common/ScrollToTop'
import NavigationBoxes from './NavigationBoxes'
import WorkflowSection from './WorkflowSection'
import ArchitectureSection from './ArchitectureSection'
import FAQ from './FAQ'

export default function Home() {
  return (
    <>
      <HeaderOne />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeroArea />
            <BrandArea />
            <AboutArea />
            <ArchitectureSection />
            <NavigationBoxes />
            <WorkflowSection />
            <ModelTestArea />
            <ContactArea />
            <LostVehicleReport />
            <ServiceArea />
            <TestimonoalArea />
            <FAQ />
          </main>
          <FooterOne />
        </div>
      </div> 
      <ScrollToTop />
      <ScrollTop />
      <CustomCursor />
    </>
  )
}
