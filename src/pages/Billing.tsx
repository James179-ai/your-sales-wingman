import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Download, 
  Calendar, 
  TrendingUp,
  Users,
  MessageCircle,
  Target,
  Crown,
  Check,
  X,
  AlertCircle
} from "lucide-react";

// Mock billing data
const currentPlan = {
  name: "Professional",
  price: 99,
  period: "month",
  features: [
    "5,000 monthly messages",
    "Unlimited campaigns", 
    "Advanced analytics",
    "Team collaboration",
    "API access",
    "Priority support"
  ],
  usage: {
    messages: { used: 3240, limit: 5000 },
    campaigns: { used: 12, limit: null },
    teamMembers: { used: 4, limit: 10 }
  }
};

const plans = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    description: "Perfect for individual sales professionals",
    features: [
      "1,000 monthly messages",
      "5 active campaigns",
      "Basic analytics",
      "Email support"
    ],
    limitations: [
      "No team collaboration",
      "Limited integrations"
    ],
    popular: false
  },
  {
    name: "Professional", 
    price: 99,
    period: "month",
    description: "Best for growing sales teams",
    features: [
      "5,000 monthly messages",
      "Unlimited campaigns",
      "Advanced analytics", 
      "Team collaboration",
      "API access",
      "Priority support"
    ],
    limitations: [],
    popular: true
  },
  {
    name: "Enterprise",
    price: 299,
    period: "month", 
    description: "For large organizations with custom needs",
    features: [
      "Unlimited messages",
      "Unlimited campaigns",
      "Advanced analytics",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee"
    ],
    limitations: [],
    popular: false
  }
];

const invoiceHistory = [
  {
    id: "INV-2024-001",
    date: "2024-01-01",
    amount: 99,
    status: "paid",
    period: "January 2024"
  },
  {
    id: "INV-2023-012",
    date: "2023-12-01", 
    amount: 99,
    status: "paid",
    period: "December 2023"
  },
  {
    id: "INV-2023-011",
    date: "2023-11-01",
    amount: 99,
    status: "paid", 
    period: "November 2023"
  },
  {
    id: "INV-2023-010",
    date: "2023-10-01",
    amount: 99,
    status: "failed",
    period: "October 2023"
  }
];

const Billing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const getUsagePercentage = (used: number, limit: number | null) => {
    if (!limit) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Billing & Usage</h1>
            <p className="text-muted-foreground mt-2">
              Manage your subscription, usage, and billing information
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
        </div>

        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your active subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{currentPlan.name}</h3>
                <p className="text-muted-foreground">
                  {formatCurrency(currentPlan.price)}/{currentPlan.period}
                </p>
              </div>
              
              <div className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 space-y-2">
                <Button className="w-full">Manage Plan</Button>
                <Button variant="destructive" className="w-full">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Usage Overview</CardTitle>
              <CardDescription>
                Your current month's usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Messages Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Messages Sent</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentPlan.usage.messages.used.toLocaleString()} / {currentPlan.usage.messages.limit?.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(currentPlan.usage.messages.used, currentPlan.usage.messages.limit)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round(getUsagePercentage(currentPlan.usage.messages.used, currentPlan.usage.messages.limit))}% of monthly limit used
                </p>
              </div>

              {/* Campaigns Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Active Campaigns</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentPlan.usage.campaigns.used} / Unlimited
                  </span>
                </div>
                <Progress value={0} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  No limit on campaigns
                </p>
              </div>

              {/* Team Members Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Team Members</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentPlan.usage.teamMembers.used} / {currentPlan.usage.teamMembers.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(currentPlan.usage.teamMembers.used, currentPlan.usage.teamMembers.limit)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round(getUsagePercentage(currentPlan.usage.teamMembers.used, currentPlan.usage.teamMembers.limit))}% of team limit used
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">Available Plans</TabsTrigger>
            <TabsTrigger value="invoices">Invoice History</TabsTrigger>
          </TabsList>

          {/* Available Plans */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span className={billingPeriod === "monthly" ? "font-medium" : "text-muted-foreground"}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                    billingPeriod === "yearly" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={billingPeriod === "yearly" ? "font-medium" : "text-muted-foreground"}>
                Yearly
                <Badge variant="secondary" className="ml-2">20% off</Badge>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        {formatCurrency(billingPeriod === "yearly" ? plan.price * 10 : plan.price)}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingPeriod === "yearly" ? "year" : "month"}
                      </span>
                      {billingPeriod === "yearly" && (
                        <p className="text-sm text-green-600">Save 20%</p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="w-4 h-4 text-red-500" />
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={plan.name === currentPlan.name ? "outline" : "default"}
                      disabled={plan.name === currentPlan.name}
                    >
                      {plan.name === currentPlan.name ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Invoice History */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoiceHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-border-subtle rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-surface-elevated rounded-lg">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{invoice.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {invoice.period} • {new Date(invoice.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant={invoice.status === 'paid' ? 'default' : 'destructive'}
                        >
                          {invoice.status === 'paid' ? 'Paid' : 'Failed'}
                        </Badge>
                        <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Billing;