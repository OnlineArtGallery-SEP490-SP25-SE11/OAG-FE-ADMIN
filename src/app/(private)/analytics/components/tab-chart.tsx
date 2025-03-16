import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { vietnamCurrency } from '@/utils';

export default function TabChart() {
    const artistMetrics = [
        { month: 'Jan', newArtists: 45, activeArtists: 120, totalArtworks: 350 },
        { month: 'Feb', newArtists: 52, activeArtists: 145, totalArtworks: 425 },
        // ... more data
    ];

    const exhibitionMetrics = [
        { 
            month: 'Jan', 
            exhibition: 'Modern Showcase',
            visitors: 12500,
            avgDuration: 45, // minutes
            rating: 4.8
        },
        { 
            month: 'Feb', 
            exhibition: 'Digital Festival',
            visitors: 8900,
            avgDuration: 38,
            rating: 4.6
        },
        { 
            month: 'Mar', 
            exhibition: 'Contemporary Masters',
            visitors: 15600,
            avgDuration: 52,
            rating: 4.9
        },
    ];

    const topArtists = [
        { name: 'Sophia Chen', artworks: 87, revenue: 8500000, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
        { name: 'Marcus Rivera', artworks: 65, revenue: 7200000, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
        { name: 'Emma Thompson', artworks: 54, revenue: 6100000, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
        { name: 'David Kim', artworks: 45, revenue: 5400000, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' },
        { name: 'Isabella Santos', artworks: 32, revenue: 4200000, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
    ];

    const recentActivities = [
        { id: 1, activity: 'Artwork Upload', time: '5 minutes ago' },
        { id: 2, activity: 'New Comment', time: '15 minutes ago' },
        { id: 3, activity: 'Collection Created', time: '30 minutes ago' },
        { id: 4, activity: 'Gallery Visit', time: '45 minutes ago' },
        { id: 5, activity: 'Artwork Purchase', time: '1 hour ago' },
    ];

    return (
        <Tabs defaultValue="artists" className="mb-8">
            <TabsList>
                <TabsTrigger value="artists">Artist Analytics</TabsTrigger>
                <TabsTrigger value="exhibitions">Exhibition Analytics</TabsTrigger>
                <TabsTrigger value="engagement">User Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="artists">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Artist Growth Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Artist Growth Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart width={500} height={300} data={artistMetrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="newArtists" stroke="#8884d8" />
                                <Line type="monotone" dataKey="activeArtists" stroke="#82ca9d" />
                            </LineChart>
                        </CardContent>
                    </Card>

                    {/* Top Artists Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Artists</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topArtists.map((artist) => (
                                    <div key={artist.name} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <img 
                                                src={artist.avatar} 
                                                alt={artist.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-medium">{artist.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {artist.artworks} artworks
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-green-500 font-medium">
                                            {vietnamCurrency(artist.revenue)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="exhibitions">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Exhibition Visitors Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Most Visited Exhibitions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BarChart width={500} height={300} data={exhibitionMetrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="exhibition" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
                            </BarChart>
                        </CardContent>
                    </Card>

                    {/* Exhibition Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Exhibition Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {exhibitionMetrics.map((metric) => (
                                    <div key={metric.month} className="space-y-2">
                                        <div className="font-medium text-lg">{metric.exhibition}</div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <div className="text-gray-500">Visitors</div>
                                                <div className="font-medium">{metric.visitors.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Avg. Duration</div>
                                                <div className="font-medium">{metric.avgDuration} mins</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Rating</div>
                                                <div className="font-medium text-yellow-500">★ {metric.rating}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="engagement">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Engagement Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Engagement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Artwork Interactions</span>
                                    <span className="font-medium">2,453 today</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Comments Posted</span>
                                    <span className="font-medium">342 today</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>New Collections Created</span>
                                    <span className="font-medium">89 today</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Activity Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-4">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                        <div>
                                            <div className="font-medium">{activity.activity}</div>
                                            <div className="text-sm text-gray-500">{activity.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
    );
}
