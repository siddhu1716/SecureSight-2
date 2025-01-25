import { useState } from 'react'

export default function ModelTestArea() {
  const [video, setVideo] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', video);

    try {
      const response = await fetch('http://localhost:5000/process-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      const data = await response.json();
      setResult(data.processedVideoUrl);
    } catch (err) {
      setError('Failed to process video. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="model-test" className="contact-area">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="section-title section-black-title wow fadeInUp delay-0-2s">
              <h2>Test Our AI Model</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Left side info panel */}
          <div className="col-lg-4">
            <div className="contact-content-part wow fadeInUp delay-0-2s">
              <div className="single-contact wow fadeInUp" data-wow-delay=".2s">
                <span className="circle-btn">
                  <i className="ri-ai-generate"></i>
                </span>
                <h2>How it works:</h2>
                <p>Upload a video to test our threat detection model</p>
              </div>

              <div className="single-contact wow fadeInUp" data-wow-delay=".4s">
                <span className="circle-btn">
                  <i className="ri-shield-check-line"></i>
                </span>
                <h2>Detects:</h2>
                <p>Weapons, Knives, and Other Threats</p>
              </div>

              <div className="single-contact wow fadeInUp" data-wow-delay=".6s">
                <span className="circle-btn">
                  <i className="ri-time-line"></i>
                </span>
                <h2>Processing Time:</h2>
                <p>Results in under 60 seconds</p>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="col-lg-8">
            <div className="contact-form contact-form-area wow fadeInUp delay-0-4s">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Upload Video</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleVideoUpload}
                        accept="video/*"
                        required
                      />
                      <small className="text-muted">Supported formats: MP4, AVI, MOV (Max 100MB)</small>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group mb-0">
                      <button 
                        type="submit" 
                        className="theme-btn"
                        disabled={!video || isProcessing}
                      >
                        {isProcessing ? (
                          <>Processing... <i className="ri-loader-4-line animate-spin"></i></>
                        ) : (
                          <>Process Video <i className="ri-play-circle-line"></i></>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="col-md-12 mt-3">
                      <div className="alert alert-danger">{error}</div>
                    </div>
                  )}

                  {result && (
                    <div className="col-md-12 mt-4">
                      <h4>Processed Video:</h4>
                      <video 
                        controls 
                        className="w-100 mt-2"
                        src={result}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 