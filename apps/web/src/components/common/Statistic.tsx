import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Statistic(props: {title: string, figure: string, note: string, icon: JSX.Element}) {
    return <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <span>{props.icon}</span>
            <CardTitle className="text-sm font-medium">
                {props.title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{props.figure}</div>
            <p className="text-xs text-muted-foreground">
                {props.note}
            </p>
        </CardContent>
    </Card>
}
