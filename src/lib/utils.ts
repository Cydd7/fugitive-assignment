import { createSelections, updateSelections } from "./actions";
import { ISelection } from "./types";

export const handleCitySelection = async (data: Record<string, string>, sessionId: string, selections: ISelection[]) => {
    let selectionsPayload = [];

    if (selections.length > 0) {
        selectionsPayload = selections.map((selection) => ({
            ...selection,
            cityId: parseInt(data[`cop-${selection.copId}`]),
        }));
        await updateSelections(selectionsPayload, 'city-selection');
    }
    else {
        selectionsPayload = Object.entries(data).map(([key, value]) => ({
            gameSessionId: sessionId,
            copId: parseInt(key.split('-')[1]),
            cityId: parseInt(value),
        }));
        await createSelections(selectionsPayload);
    }
}