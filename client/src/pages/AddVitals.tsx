import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Activity, ArrowLeft, Droplet, Weight, Thermometer } from "lucide-react";
import { toast } from "sonner";

const AddVitals = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bloodPressure: "",
    sugarLevel: "",
    weight: "",
    temperature: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVital = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingVitals = JSON.parse(localStorage.getItem("healthVitals") || "[]");
    existingVitals.unshift(newVital);
    localStorage.setItem("healthVitals", JSON.stringify(existingVitals));

    toast.success("Vitals recorded successfully!");
    navigate("/dashboard");
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Add Manual Vitals</h1>
            <p className="text-xl text-muted-foreground">
              Track kar apni daily health - Track your daily health metrics
            </p>
          </div>

          <Card className="p-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure" className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Blood Pressure (BP)
                  </Label>
                  <Input
                    id="bloodPressure"
                    placeholder="e.g., 120/80"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">Format: Systolic/Diastolic</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sugarLevel" className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-secondary" />
                    Blood Sugar Level
                  </Label>
                  <Input
                    id="sugarLevel"
                    placeholder="e.g., 95 mg/dL"
                    value={formData.sugarLevel}
                    onChange={handleChange}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">Fasting or Random</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-accent" />
                    Weight
                  </Label>
                  <Input
                    id="weight"
                    placeholder="e.g., 70 kg"
                    value={formData.weight}
                    onChange={handleChange}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">In kg or lbs</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-destructive" />
                    Temperature
                  </Label>
                  <Input
                    id="temperature"
                    placeholder="e.g., 98.6°F"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">In °F or °C</p>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about your health today..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gradient-to-r from-secondary to-secondary/80 hover:opacity-90"
              >
                <Activity className="h-5 w-5 mr-2" />
                Save Vitals
              </Button>
            </form>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">Normal BP Range</h3>
                <p className="text-sm text-muted-foreground">
                  Normal: 120/80 mmHg<br />
                  High: Above 130/80 mmHg
                </p>
              </Card>

              <Card className="p-4 bg-secondary/5 border-secondary/20">
                <h3 className="font-semibold text-foreground mb-2">Normal Sugar Level</h3>
                <p className="text-sm text-muted-foreground">
                  Fasting: 70-100 mg/dL<br />
                  Random: Below 140 mg/dL
                </p>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddVitals;