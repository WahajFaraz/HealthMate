import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ArrowLeft, FileText, Brain, Loader2, AlertCircle, Languages } from "lucide-react";
import { toast } from "sonner";

const ViewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [language, setLanguage] = useState<"english" | "urdu">("english");

  useEffect(() => {
    // Load report from localStorage
    const reports = JSON.parse(localStorage.getItem("healthReports") || "[]");
    const foundReport = reports.find((r: any) => r.id === id);
    
    if (!foundReport) {
      toast.error("Report not found");
      navigate("/dashboard");
      return;
    }

    setReport(foundReport);

    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        summary: {
          english: `This ${foundReport.type} report from ${foundReport.date} shows your health parameters. The AI has analyzed the document and identified key findings.`,
          urdu: `Yeh ${foundReport.type} report ${foundReport.date} ki hai aur aapki sehat ke bare mein important jankaari hai.`
        },
        abnormalValues: [
          { 
            parameter: "Hemoglobin (Hb)", 
            value: "11.2 g/dL", 
            normal: "13-17 g/dL", 
            status: "Low",
            note: { 
              english: "Slightly below normal range. May indicate anemia.", 
              urdu: "Normal se thora kam hai. Anemia ho sakta hai." 
            }
          },
          { 
            parameter: "White Blood Cells (WBC)", 
            value: "12,000 /µL", 
            normal: "4,000-11,000 /µL", 
            status: "High",
            note: { 
              english: "Elevated. May indicate infection or inflammation.", 
              urdu: "Zyada hai. Infection ya inflammation ho sakta hai." 
            }
          }
        ],
        doctorQuestions: {
          english: [
            "Should I be concerned about my low hemoglobin levels?",
            "What could be causing the elevated white blood cell count?",
            "Do I need to take any iron supplements?",
            "Are there any dietary changes I should make?",
            "When should I get retested?"
          ],
          urdu: [
            "Kya mujhe apne kam hemoglobin level se chinta karni chahiye?",
            "White blood cells kyon zyada hain?",
            "Kya mujhe iron supplements lene chahiye?",
            "Kya mujhe apni diet mein koi changes karne chahiye?",
            "Mujhe dobara test kab karwana chahiye?"
          ]
        },
        foodSuggestions: {
          avoid: {
            english: ["Excessive tea/coffee (reduces iron absorption)", "Processed foods", "High sodium foods"],
            urdu: ["Zyada chai/coffee (iron absorption kam hota hai)", "Processed foods", "Zyada namak wale khane"]
          },
          recommended: {
            english: ["Leafy green vegetables (spinach, kale)", "Red meat and liver", "Citrus fruits (Vitamin C)", "Legumes and beans", "Iron-fortified cereals"],
            urdu: ["Hari sabziyan (palak, methi)", "Laal gosht aur kaleji", "Nimbu aur santre (Vitamin C)", "Dal aur rajma", "Iron fortified cereals"]
          }
        },
        homeRemedies: {
          english: [
            "Drink warm water with lemon in the morning",
            "Include dates and raisins in daily diet",
            "Get adequate rest (7-8 hours sleep)",
            "Practice light exercise daily"
          ],
          urdu: [
            "Subah garam pani mein nimbu daal kar piyen",
            "Khajoor aur kishmish daily khayen",
            "Achhi neend len (7-8 ghante)",
            "Halki exercise daily karen"
          ]
        }
      };

      setAiAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2500);
  }, [id, navigate]);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">HealthMate</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "english" ? "urdu" : "english")}
            >
              <Languages className="h-4 w-4 mr-2" />
              {language === "english" ? "Roman Urdu" : "English"}
            </Button>
            <Link to="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Report Header */}
          <div className="mb-8 animate-fade-up">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">{report.title}</h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <span>Type: {report.type}</span>
                  <span>•</span>
                  <span>Date: {report.date}</span>
                  <span>•</span>
                  <span>Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Document Preview */}
            <Card className="lg:col-span-1 p-6 animate-fade-up">
              <h3 className="text-lg font-semibold text-foreground mb-4">Document Preview</h3>
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">{report.fileName}</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    View Full Document
                  </Button>
                </div>
              </div>
            </Card>

            {/* AI Analysis */}
            <Card className="lg:col-span-2 p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Brain className="h-16 w-16 text-primary mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">AI Analysis in Progress</h3>
                  <p className="text-muted-foreground">
                    {language === "english" 
                      ? "Reading and analyzing your report..." 
                      : "Aapki report padhi ja rahi hai..."}
                  </p>
                  <Loader2 className="h-6 w-6 animate-spin text-primary mt-4" />
                </div>
              ) : (
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="abnormal">Abnormal</TabsTrigger>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="food">Food</TabsTrigger>
                    <TabsTrigger value="remedies">Remedies</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        AI Summary
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {aiAnalysis.summary[language]}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="abnormal" className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Abnormal Values</h3>
                    {aiAnalysis.abnormalValues.map((item: any, index: number) => (
                      <Card key={index} className="p-4 bg-destructive/5 border-destructive/20">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-foreground">{item.parameter}</h4>
                              <span className="text-sm font-medium text-destructive">{item.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              <div>
                                <span className="text-muted-foreground">Your Value: </span>
                                <span className="font-medium text-foreground">{item.value}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Normal: </span>
                                <span className="font-medium text-foreground">{item.normal}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.note[language]}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="questions" className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Questions to Ask Your Doctor</h3>
                    {aiAnalysis.doctorQuestions[language].map((question: string, index: number) => (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                        <p className="text-foreground">{index + 1}. {question}</p>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="food" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-destructive mb-3">Foods to Avoid</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.foodSuggestions.avoid[language].map((food: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-destructive mt-1">✗</span>
                            <span className="text-muted-foreground">{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary mb-3">Recommended Foods</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.foodSuggestions.recommended[language].map((food: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-secondary mt-1">✓</span>
                            <span className="text-muted-foreground">{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="remedies" className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Home Remedies</h3>
                    {aiAnalysis.homeRemedies[language].map((remedy: string, index: number) => (
                      <Card key={index} className="p-4 bg-secondary/5 border-secondary/20">
                        <p className="text-foreground">{remedy}</p>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              )}

              {/* Disclaimer */}
              <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-accent">Important:</strong>{" "}
                  {language === "english"
                    ? "This AI analysis is for informational purposes only. Always consult with your doctor before making any health decisions."
                    : "Yeh AI analysis sirf jankaari ke liye hai. Koi bhi health decision lene se pehle apne doctor se zaroor baat karen."}
                </p>
              </Card>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;