import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RetroThemeTest() {
    return (
        <div className="min-h-screen p-8 flex flex-col gap-8 bg-background text-foreground font-mono">
            <h1 className="text-4xl font-bold text-primary">Retro Terminal Theme Test</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Login System</CardTitle>
                        <CardDescription>Enter your credentials to access the mainframe.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" placeholder="admin" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Authenticate</Button>
                    </CardFooter>
                </Card>

                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">System Alert</CardTitle>
                        <CardDescription>Critical system failure detected.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Error Code: 0x0000001</p>
                        <p>Memory Dump: Initiated...</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="destructive" className="w-full">Reboot System</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
