import Main from "@/components/Main";
import MoodTrackingComponent from "@/components/MoodTrackingComponent"; // Import your mood tracking component

export const metadata = {
    title: "Broodl · Mood Tracking",
};

export default function MoodTrackingPage() {
    return (
        <Main>
            <MoodTrackingComponent />
        </Main>
    );
}
