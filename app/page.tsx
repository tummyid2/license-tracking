'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Bell, Shield, Search, Smartphone, LogIn, ArrowRight, CheckCircle2, BarChart3, Lock } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">LicenseGuard</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <ThemeToggle />
                        <div className="hidden sm:flex gap-3">
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login">
                                    เข้าสู่ระบบ
                                </Link>
                            </Button>
                            <Button asChild size="sm" className="rounded-full px-6">
                                <Link href="/dashboard">
                                    Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        {/* Mobile Menu Button (Simplified for now) */}
                        <Button asChild size="sm" className="sm:hidden rounded-full">
                            <Link href="/dashboard">
                                <LogIn className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40 bg-gradient-to-b from-background via-primary/5 to-background">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
                    <div className="container relative px-4 sm:px-8 text-center">
                        <div className="mx-auto max-w-3xl space-y-8">
                            <div className="animate-fade-in-up inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                                ระบบจัดการใบอนุญาตเวอร์ชันใหม่
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
                                จัดการใบอนุญาต
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mt-2 pb-2">
                                    อย่างมืออาชีพ
                                </span>
                            </h1>

                            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                                หมดกังวลเรื่องใบอนุญาตหมดอายุ ด้วยระบบแจ้งเตือนอัจฉริยะผ่าน LINE
                                พร้อม Dashboard ที่ช่วยให้คุณเห็นภาพรวมธุรกิจได้ในที่เดียว
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Button asChild size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                    <Link href="/dashboard">
                                        เริ่มต้นใช้งานฟรี
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80">
                                    <Link href="/login">
                                        เข้าสู่ระบบ
                                    </Link>
                                </Button>
                            </div>

                            {/* Stats Preview */}
                            <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-border/50 mt-12">
                                <div>
                                    <div className="text-3xl font-bold text-primary">100%</div>
                                    <div className="text-sm text-muted-foreground mt-1">แจ้งเตือนทันเวลา</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">24/7</div>
                                    <div className="text-sm text-muted-foreground mt-1">ทำงานอัตโนมัติ</div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="text-3xl font-bold text-primary">Secure</div>
                                    <div className="text-sm text-muted-foreground mt-1">ข้อมูลปลอดภัย</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 sm:py-32 bg-muted/30">
                    <div className="container px-4 sm:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                                ครบทุกฟังก์ชันที่คุณต้องการ
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                ออกแบบมาเพื่อลดภาระงานและเพิ่มประสิทธิภาพในการจัดการข้อมูล
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Feature 1 */}
                            <Card className="group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-2xl bg-[#00B900]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Bell className="h-6 w-6 text-[#00B900]" />
                                    </div>
                                    <CardTitle className="text-xl">LINE Notification</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        แจ้งเตือนตรงถึงมือถือผ่าน LINE Official Account ทันทีเมื่อใกล้ถึงกำหนดต่ออายุ (90, 60, 30 วัน)
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            {/* Feature 2 */}
                            <Card className="group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <BarChart3 className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <CardTitle className="text-xl">Smart Dashboard</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        เห็นภาพรวมสถานะใบอนุญาตทั้งหมด กราฟสรุป และรายการที่ต้องดำเนินการเร่งด่วนในหน้าเดียว
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            {/* Feature 3 */}
                            <Card className="group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Search className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <CardTitle className="text-xl">Advanced Search</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        ค้นหาข้อมูลได้รวดเร็วด้วยระบบกรองหลายชั้น แยกตามบริษัท ประเภท หรือสถานะใบอนุญาต
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            {/* Feature 4 */}
                            <Card className="group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Lock className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <CardTitle className="text-xl">Secure Access</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        ระบบยืนยันตัวตนที่ปลอดภัย จำกัดสิทธิ์การเข้าถึงข้อมูล และป้องกันการเข้าถึงจากภายนอก
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            {/* Feature 5 */}
                            <Card className="group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Smartphone className="h-6 w-6 text-pink-500" />
                                    </div>
                                    <CardTitle className="text-xl">Mobile Ready</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        ใช้งานได้ทุกที่ทุกเวลา รองรับการแสดงผลบนมือถือและแท็บเล็ตอย่างสมบูรณ์แบบ
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            {/* Feature 6 */}
                            <Card className="group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Shield className="h-6 w-6 text-teal-500" />
                                    </div>
                                    <CardTitle className="text-xl">Data Protection</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        ปกป้องข้อมูลสำคัญของคุณด้วยมาตรฐานความปลอดภัยระดับสูง และการสำรองข้อมูลอัตโนมัติ
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 sm:py-32">
                    <div className="container px-4 sm:px-8">
                        <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 sm:px-16 sm:py-24 text-center shadow-2xl">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                                <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                                    พร้อมยกระดับการจัดการใบอนุญาตหรือยัง?
                                </h2>
                                <p className="text-lg text-primary-foreground/80">
                                    เริ่มต้นใช้งานวันนี้ เพื่อการจัดการที่เป็นระบบและปลอดภัยยิ่งขึ้น
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-lg rounded-full font-semibold">
                                        <Link href="/dashboard">
                                            เข้าสู่ระบบ Dashboard
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/20">
                <div className="container px-4 sm:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-primary p-1.5 rounded-lg">
                                    <Shield className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <span className="font-bold text-xl">LicenseGuard</span>
                            </div>
                            <p className="text-muted-foreground max-w-sm">
                                ระบบติดตามและแจ้งเตือนใบอนุญาตอัจฉริยะ ช่วยให้ธุรกิจของคุณดำเนินไปอย่างราบรื่นไม่มีสะดุด
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-foreground">เมนูหลัก</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li>
                                    <Link href="/dashboard" className="hover:text-primary transition-colors">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin" className="hover:text-primary transition-colors">
                                        Admin Panel
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="hover:text-primary transition-colors">
                                        เข้าสู่ระบบ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-foreground">ติดต่อเรา</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li>Line Official: @LicenseGuard</li>
                                <li>Email: support@licenseguard.com</li>
                                <li>Tel: 02-xxx-xxxx</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} LicenseGuard. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
