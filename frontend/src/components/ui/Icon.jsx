import {
  // Navigation
  Home, Users, BookOpen, Award, User,
  // Core training / streaks
  PawPrint, Footprints, Flame, Star, Trophy, Crown, Shield, Medal,
  Sparkles, Sprout, TrendingUp, Target, Zap, Rocket, Calendar, Brain,
  GraduationCap, Dumbbell, Swords, Waves, Moon, Rainbow, Snowflake,
  ShieldCheck, Crosshair, Globe, Timer, Wand2,
  // Content / journal
  PenLine, Pen, Camera, Image, Leaf, Gem, Landmark,
  // Programs / data
  Megaphone, Puzzle, House, Droplets, Dog,
  // Gear
  Bell, UtensilsCrossed, Link2, LayoutGrid, WandSparkles, BedDouble,
  ShoppingBag,
  // Health
  Heart, HeartPulse, Scale, Syringe, Pill, Hospital, Stethoscope,
  Thermometer, Eye, Bone, Bug,
  // Emergency
  AlertTriangle, Skull, CircleAlert, AlertOctagon, ShieldAlert,
  // Diagnostic
  Volume2, HeartCrack, EarOff, ArrowUpFromLine,
  // UI
  Search, ShoppingCart, Clock, Lock, CheckCircle2, ChevronRight,
  ChevronLeft, Plus, Minus, X, Check, Send, Share2, Copy,
  Upload, Download, Phone, Mail, ExternalLink, Settings, Info,
  // Community
  MessageCircle, ThumbsUp, Flag,
  // Lost Dog / Map
  MapPin, AlertCircle, MapPinned, Route,
  // Misc
  Handshake, HeartHandshake, TreePine, Sunrise, Glasses, Coins, Bot,
  // Badge-specific
  Mountain, Sun, Diamond, CalendarCheck, Gauge, Sparkle,
  Wrench, Box, DoorOpen, Layers, Aperture,
  // Walk
  Pause, Play, Square,
  // Extra
  Pencil, Trash2, MoreHorizontal, ArrowLeft, Filter,
  CircleDot, Bookmark, Tag, FileText, Activity,
  // Profile / Settings
  LogOut, HelpCircle, MessageSquare, Smartphone, Volume1,
} from "lucide-react";

const ICONS = {
  Home, Users, BookOpen, Award, User,
  PawPrint, Footprints, Flame, Star, Trophy, Crown, Shield, Medal,
  Sparkles, Sprout, TrendingUp, Target, Zap, Rocket, Calendar, Brain,
  GraduationCap, Dumbbell, Swords, Waves, Moon, Rainbow, Snowflake,
  ShieldCheck, Crosshair, Globe, Timer, Wand2,
  PenLine, Pen, Camera, Image, Leaf, Gem, Landmark,
  Megaphone, Puzzle, House, Droplets, Dog,
  Bell, UtensilsCrossed, Link2, LayoutGrid, WandSparkles, BedDouble,
  ShoppingBag,
  Heart, HeartPulse, Scale, Syringe, Pill, Hospital, Stethoscope,
  Thermometer, Eye, Bone, Bug,
  AlertTriangle, Skull, CircleAlert, AlertOctagon, ShieldAlert,
  Volume2, HeartCrack, EarOff, ArrowUpFromLine,
  Search, ShoppingCart, Clock, Lock, CheckCircle2, ChevronRight,
  ChevronLeft, Plus, Minus, X, Check, Send, Share2, Copy,
  Upload, Download, Phone, Mail, ExternalLink, Settings, Info,
  MessageCircle, ThumbsUp, Flag,
  MapPin, AlertCircle, MapPinned, Route,
  Handshake, HeartHandshake, TreePine, Sunrise, Glasses, Coins, Bot,
  Mountain, Sun, Diamond, CalendarCheck, Gauge, Sparkle,
  Wrench, Box, DoorOpen, Layers, Aperture,
  Pause, Play, Square,
  Pencil, Trash2, MoreHorizontal, ArrowLeft, Filter,
  CircleDot, Bookmark, Tag, FileText, Activity,
  LogOut, HelpCircle, MessageSquare, Smartphone, Volume1,
};

export default function Icon({ name, size = 20, color, strokeWidth = 2, style }) {
  const LucideIcon = ICONS[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} color={color} strokeWidth={strokeWidth} style={style} />;
}
