import { useState, useEffect } from "react"; // <-- UPDATED
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { QRCodeSVG } from "qrcode.react";
import api from "../services/api"; // <-- ADDED

// QR Code component remains the same, but we update the URL it uses
const QRCodeModal = ({ link, onClose }) => {
  if (!link) return null;
  // Use the full shortUrl from the API
  const fullShortUrl = link.shortUrl;
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 space-y-4 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center">QR Code</h2>
        <div className="bg-white p-4 rounded-md">
          <QRCodeSVG value={fullShortUrl} size={256} />
        </div>
        <p className="text-center font-semibold">{fullShortUrl}</p>
        <Button
          onClick={onClose}
          className="w-full bg-[#040F0F] text-white hover:bg-[#040F0F]/90"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  // --- REPLACED LOGIC: REAL STATE MANAGEMENT ---
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/links");
      setLinks(response.data);
    } catch (error) {
      setToastMessage("Error fetching links.");
      setTimeout(() => setToastMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreateLink = async (data) => {
    try {
      await api.post("/shorten", { longUrl: data.url });
      reset();
      fetchLinks(); // Refresh the list
      setToastMessage("Link created successfully!");
    } catch (error) {
      setToastMessage("Failed to create link.");
    } finally {
      setTimeout(() => setToastMessage(""), 2000);
    }
  };

  const handleDelete = (idToDelete) => {
    // Note: A backend endpoint would be needed for permanent deletion.
    // This is a temporary UI-only delete for now.
    setLinks(links.filter((link) => link.id !== idToDelete));
    setToastMessage("Link successfully deleted!");
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleCopy = (fullUrl) => {
    navigator.clipboard.writeText(fullUrl);
    setToastMessage(`Copied to clipboard: ${fullUrl}`);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleShowQrCode = (link) => {
    setSelectedLink(link);
    setIsModalOpen(true);
  };
  // ---------------------------------------------------

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="w-full max-w-5xl space-y-6 animate-fade-in-up">
        <section>
          <Card className="bg-white text-[#040F0F] border-slate-200">
            <CardHeader>
              <CardTitle>Create a New Link</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(handleCreateLink)}
                className="flex flex-col sm:flex-row gap-2"
              >
                <Input
                  {...register("url", { required: true })}
                  type="url"
                  placeholder="https://your-long-url.com/goes/here"
                  className="flex-grow"
                />
                <Button
                  type="submit"
                  className="bg-[#040F0F] text-white hover:bg-[#040F0F]/90"
                >
                  Shorten!
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4 text-white">Your Links</h2>
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-4">
            {/* --- UPDATED TO RENDER REAL DATA --- */}
            {loading ? (
              <p className="text-white text-center">Loading links...</p>
            ) : (
              links.map((link) => (
                <Card
                  key={link.id}
                  className="bg-white text-[#040F0F] border-slate-200"
                >
                  <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-grow">
                      <p className="font-bold text-lg">
                        {/* Display the path from the full URL */}
                        {link.shortUrl.replace(/^https?:\/\//, "")}
                      </p>
                      <p className="text-sm text-slate-500 truncate max-w-md">
                        {link.originalUrl}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Use the 'clicks' property from the backend */}
                      <p className="font-bold text-xl">
                        {link.totalClicks}
                      </p>{" "}
                      <p className="text-sm rounded-xl p-2 bg-slate-900 text-white">
                        Clicks
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopy(link.shortUrl)}
                        size="sm"
                        className="bg-slate-900 text-white hover:bg-slate-700"
                      >
                        Copy
                      </Button>
                      <Button
                        onClick={() => handleShowQrCode(link)}
                        size="sm"
                        className="bg-slate-900 text-white hover:bg-slate-700"
                      >
                        QR Code
                      </Button>
                      <Button
                        onClick={() => handleDelete(link.id)}
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {/* -------------------------------------- */}
          </div>
        </section>
      </div>

      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-up">
          {toastMessage}
        </div>
      )}

      {isModalOpen && (
        <QRCodeModal
          link={selectedLink}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default DashboardPage;
