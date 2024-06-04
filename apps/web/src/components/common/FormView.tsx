
function Title(props: { children: any }) {
    return <h2 className="font-bold text-2xl text-gray-500/80 mt-4">{props.children}</h2>
}

function SubTitle(props: { children: any }) {
    return <h2 className="font-bold text-xl text-gray-500/80 mt-4">{props.children}</h2>
}

function LabeledField(props: { label: string, children: any }) {
    return <>
        <div className="text-xs text-gray-500/80">{props.label}</div>
        <div>{props.children}</div>
    </>
}

export const FormView = {
    Title,
    SubTitle,
    LabeledField,
}