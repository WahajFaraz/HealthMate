import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Brain, 
  Shield, 
  Clock, 
  TrendingUp, 
  Heart,
  Upload,
  MessageCircle,
  CheckCircle
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">HealthMate</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">Security</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              AI-Powered Health Management
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
              Your Smart Health
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Companion</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Upload medical reports, get instant AI summaries in English & Roman Urdu. 
              Track your health journey all in one secure place.
            </p>
            <p className="text-lg text-muted-foreground italic">
              आपकी सेहत का स्मार्ट दोस्त - Sehat ka Smart Dost
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">100% Secure</span>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl animate-pulse-glow"></div>
            <Card className="relative p-8 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop" 
                alt="Medical Dashboard Preview"
                className="rounded-lg w-full h-auto"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your health records intelligently
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="h-12 w-12 text-primary" />,
                title: "Easy Upload",
                description: "Upload PDFs, images, or scanned reports. Our AI reads everything.",
                urdu: "आसान अपलोड - PDF ya image upload karo"
              },
              {
                icon: <Brain className="h-12 w-12 text-primary" />,
                title: "AI-Powered Analysis",
                description: "Get instant summaries, highlights of abnormal values, and doctor questions.",
                urdu: "AI द्वारा विश्लेषण - Instant summary aur suggestions"
              },
              {
                icon: <MessageCircle className="h-12 w-12 text-primary" />,
                title: "Bilingual Support",
                description: "Understand reports in English & Roman Urdu for better clarity.",
                urdu: "दोभाषी समर्थन - English aur Roman Urdu mein samjho"
              },
              {
                icon: <TrendingUp className="h-12 w-12 text-secondary" />,
                title: "Track Vitals",
                description: "Manually add BP, sugar, weight and track trends over time.",
                urdu: "जीवन संकेत ट्रैक करें - BP, sugar track karo"
              },
              {
                icon: <Clock className="h-12 w-12 text-secondary" />,
                title: "Medical Timeline",
                description: "View your complete health history sorted by date in one place.",
                urdu: "चिकित्सा समयरेखा - Sari history ek jagah"
              },
              {
                icon: <Shield className="h-12 w-12 text-secondary" />,
                title: "Secure & Private",
                description: "Bank-level encryption. Your data is safe and only accessible by you.",
                urdu: "सुरक्षित और निजी - Aapka data safe hai"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground mb-2">{feature.description}</p>
                <p className="text-sm text-primary/70 italic">{feature.urdu}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to better health management</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Create your free account in seconds", icon: <Heart /> },
              { step: "2", title: "Upload Reports", description: "Add your medical reports & prescriptions", icon: <Upload /> },
              { step: "3", title: "AI Analysis", description: "Get instant AI-powered summaries", icon: <Brain /> },
              { step: "4", title: "Track Health", description: "Monitor your health journey over time", icon: <TrendingUp /> }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="mb-3 flex justify-center text-primary">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6 text-foreground">Your Privacy is Our Priority</h2>
            <p className="text-xl text-muted-foreground mb-8">
              We use bank-level encryption to protect your medical data. Your reports are stored securely 
              and are only accessible by you.
            </p>
            <Card className="p-8 bg-card/50 backdrop-blur">
              <p className="text-lg text-muted-foreground mb-4">
                <strong className="text-accent">Important Disclaimer:</strong> HealthMate's AI is designed 
                to help you understand your medical reports better. It is <strong>not a substitute for professional 
                medical advice</strong>. Always consult with your doctor before making any health decisions.
              </p>
              <p className="text-sm text-muted-foreground italic">
                यह AI केवल समझने के लिए है, इलाज के लिए नहीं - Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-secondary p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users managing their health records smartly
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">HealthMate</span>
              </div>
              <p className="text-muted-foreground">Your smart health companion for better health management.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
                <li><a href="#security" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 HealthMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;