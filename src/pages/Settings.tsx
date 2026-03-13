import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-6 max-w-2xl">
        <h1 className="font-pixel text-lg text-foreground mb-2">Dress Code</h1>
        <p className="text-sm text-muted-foreground mb-8">Configure your onboarding style.</p>

        <div className="space-y-8">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-6 border border-border space-y-4"
          >
            <h3 className="font-pixel text-xs text-foreground">Welcome Message</h3>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Message text</Label>
              <Input
                defaultValue="👋 Welcome! Let's get you set up."
                className="bg-muted border-border"
              />
            </div>
          </motion.div>

          {/* Nickname Format */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-6 border border-border space-y-4"
          >
            <h3 className="font-pixel text-xs text-foreground">Nickname Format</h3>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Template</Label>
              <Input
                defaultValue="{name} ({org})"
                className="bg-muted border-border"
              />
              <p className="text-xs text-muted-foreground">Preview: Alex Chen (Acme Inc)</p>
            </div>
          </motion.div>

          {/* Toggles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-6 border border-border space-y-5"
          >
            <h3 className="font-pixel text-xs text-foreground">Options</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Confirmation step</p>
                <p className="text-xs text-muted-foreground">Members review answers before submitting</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Auto role assignment</p>
                <p className="text-xs text-muted-foreground">Assign roles based on answers</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Privacy notice</p>
                <p className="text-xs text-muted-foreground">Show privacy message before onboarding</p>
              </div>
              <Switch />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-6 border border-border space-y-4"
          >
            <h3 className="font-pixel text-xs text-foreground">Success Message</h3>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Message text</Label>
              <Input
                defaultValue="You're in. Don't cause trouble. 😎"
                className="bg-muted border-border"
              />
            </div>
          </motion.div>

          <Button className="gradient-mint-lavender text-primary-foreground font-pixel text-[10px] px-8 py-5">
            Save Dress Code
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
