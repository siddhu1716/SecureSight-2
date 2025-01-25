import { useState } from 'react'

export default function LostVehicleReport() {
  const [ownerName, setOwnerName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Vehicle Report submitted:', { 
      ownerName, 
      plateNumber, 
      vehicleDetails, 
      lostLocation, 
      vehicleImage 
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVehicleImage(e.target.files[0]);
    }
  };

  const getLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLostLocation(`${latitude}, ${longitude}`);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  };

  return (
    <section id="lost-vehicle" className="contact-area">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="section-title section-black-title wow fadeInUp delay-0-2s">
              <h2>Report Lost Vehicle</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Left side info panel */}
          <div className="col-lg-4">
            <div className="contact-content-part wow fadeInUp delay-0-2s">
              <div className="single-contact wow fadeInUp" data-wow-delay=".2s">
                <span className="circle-btn">
                  <i className="ri-car-line"></i>
                </span>
                <h2>Important:</h2>
                <p>File a police report immediately</p>
              </div>

              <div className="single-contact wow fadeInUp" data-wow-delay=".4s">
                <span className="circle-btn">
                  <i className="ri-phone-line"></i>
                </span>
                <h2>Police Helpline:</h2>
                <p>100</p>
              </div>

              <div className="single-contact wow fadeInUp" data-wow-delay=".6s">
                <span className="circle-btn">
                  <i className="ri-mail-line"></i>
                </span>
                <h2>Support Email:</h2>
                <p>vehiclesupport@securesight.com</p>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="col-lg-8">
            <div className="contact-form contact-form-area wow fadeInUp delay-0-4s">
              <form id="vehicleReportForm" className="contact-form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="ownerName">Owner's Name</label>
                      <input
                        type="text"
                        id="ownerName"
                        className="form-control"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Enter owner's full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="plateNumber">Vehicle Number Plate</label>
                      <input
                        type="text"
                        id="plateNumber"
                        className="form-control"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value)}
                        placeholder="Enter vehicle plate number"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="vehicleDetails">Vehicle Details</label>
                      <textarea
                        id="vehicleDetails"
                        className="form-control"
                        rows={4}
                        value={vehicleDetails}
                        onChange={(e) => setVehicleDetails(e.target.value)}
                        placeholder="Enter vehicle make, model, color, and any distinguishing features..."
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="lostLocation">Last Seen Location</label>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          id="lostLocation"
                          className="form-control"
                          value={lostLocation}
                          onChange={(e) => setLostLocation(e.target.value)}
                          placeholder="Enter last known location"
                          required
                        />
                        <button 
                          type="button" 
                          className="theme-btn" 
                          onClick={getLocation}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Fetching...' : 'Get Location'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Vehicle Image</label>
                      <input
                        type="file"
                        id="vehicleImage"
                        className="form-control"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                      <small className="text-muted">Upload any previous images of the vehicle</small>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group mb-0">
                      <button type="submit" className="theme-btn">
                        Submit Report <i className="ri-send-plane-line"></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-12 text-center">
                    <p className="input-success">Your vehicle report has been submitted successfully!</p>
                    <p className="input-error">Sorry, report submission failed. Please try again.</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 