import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Upload, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { reportsApi } from "@/lib/api";

const UploadReport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title || !reportType) {
      toast.error("Please fill all required fields and select a file");
      return;
    }

    setIsUploading(true);

    try {
      // Upload file using real API
      const result = await reportsApi.uploadReport(file, {
        title,
        type: reportType,
        description,
      });

      toast.success("Report uploaded successfully! AI analysis in progress...");
      navigate(`/view-report/${result.id}`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload report. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">HealthMate</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-4xl font-bold text-foreground mb-2">Upload Medical Report</h1>
            <p className="text-xl text-muted-foreground">
              Upload kar aur AI se samjho - Upload and get AI insights
            </p>
          </div>

          <Card className="p-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div>
                <Label className="text-lg mb-3 block">Report File</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-3 text-foreground">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">
                        Drag and drop your file here
                      </p>
                      <p className="text-muted-foreground mb-4">
                        or click to browse (PDF, JPG, PNG)
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload">
                        <Button type="button" variant="outline" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                    </>
                  )}
                </div>
              </div>

              {/* Report Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Blood Test - Jan 2025"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood-test">Blood Test</SelectItem>
                      <SelectItem value="urine-test">Urine Test</SelectItem>
                      <SelectItem value="x-ray">X-Ray</SelectItem>
                      <SelectItem value="ultrasound">Ultrasound</SelectItem>
                      <SelectItem value="mri">MRI Scan</SelectItem>
                      <SelectItem value="ct-scan">CT Scan</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Additional notes about the report"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Uploading & Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Report
                  </>
                )}
              </Button>
            </form>

            {/* Info Box */}
            <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Your report will be analyzed by AI
                to provide summaries in English and Roman Urdu. This typically takes a few seconds.
              </p>
            </Card>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;