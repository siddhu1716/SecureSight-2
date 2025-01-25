import { useState } from 'react'

export default function ContactArea() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Report submitted:', { description, location, media });
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      if (data.results[0]) {
        setLocation(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  const getLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await getAddressFromCoords(latitude, longitude);
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
    <section id="report" className="contact-area">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="section-title section-black-title wow fadeInUp delay-0-2s">
              <h2>Report an Incident</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Left side info panel */}
          <div className="col-lg-4">
            <div className="contact-content-part wow fadeInUp delay-0-2s">
              <div className="single-contact wow fadeInUp" data-wow-delay=".2s">
                <span className="circle-btn">
                  <i className="ri-shield-line"></i>
                </span>
                <h2>Emergency:</h2>
                <p>Call 911 for immediate assistance</p>
              </div>

              <div className="single-contact wow fadeInUp" data-wow-delay=".4s">
                <span className="circle-btn">
                  <i className="ri-phone-line"></i>
                </span>
                <h2>Helpline:</h2>
                <p>+1234567890</p>
              </div>

              <div className="single-contact wow fadeInUp" data-wow-delay=".6s">
                <span className="circle-btn">
                  <i className="ri-mail-line"></i>
                </span>
                <h2>Support Email:</h2>
                <p>support@securesight.com</p>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="col-lg-8">
            <div className="contact-form contact-form-area wow fadeInUp delay-0-4s">
              <form id="reportForm" className="contact-form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="description">Incident Description</label>
                      <textarea
                        id="description"
                        className="form-control"
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe what you witnessed..."
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          id="location"
                          className="form-control"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Enter incident location"
                          required
                        />
                        <button 
                          type="button" 
                          className="theme-btn" 
                          onClick={getLocation}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            'Fetching...'
                          ) : (
                            <>
                              Get Location <i className="ri-map-pin-line"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Media Upload</label>
                      <div className="d-flex gap-2">
                        <input
                          type="file"
                          id="media"
                          className="form-control"
                          onChange={handleMediaUpload}
                          accept="image/*,video/*"
                        />
                        <button type="button" className="theme-btn">
                          Capture <i className="ri-camera-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group mb-0">
                      <button type="submit" className="theme-btn">
                        Send Report <i className="ri-send-plane-line"></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-12 text-center">
                    <p className="input-success">Your report has been submitted successfully!</p>
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
