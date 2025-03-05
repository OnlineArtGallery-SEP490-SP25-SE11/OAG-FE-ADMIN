import EventTable from './components/EventTable';

export default function Event({ accessToken }: { accessToken: string }) {
    return (
            <EventTable accessToken={accessToken} />
    );
}