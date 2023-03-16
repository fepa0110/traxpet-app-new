import { View } from "react-native";
import { Svg, Circle, Text } from "react-native-svg";
import { ColorsApp } from "constants/Colors";

export const CircularProgress = (props) => {
	const size = props.size;
	const circunferencia = size * 2.5;
	const radio = circunferencia / (2 * Math.PI);

	const progress = circunferencia - (props.progress * circunferencia) / 100;

	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "row",
			}}>
			<Svg height={size} width={size}>
				<Text
					stroke={props.valueColor}
					x={size / 2}
					y={size / 2 - 10}
					textAnchor="middle"
					fontStyle="normal"
					fontSize={props.valueSize}
					fill={props.valueColor}>
					{props.value}
				</Text>
				<Text
					stroke={props.titleColor}
                    strokeWidth={0.5}
					x={size / 2}
					y={size / 2 + 20}
					textAnchor="middle"
					fontStyle="normal"
					fontSize={props.titleSize}
					fill={props.titleColor}>
					{props.title}
				</Text>
				<Text
					stroke={props.subtitleColor}
					strokeWidth={0.5}
					x={size / 2}
					y={size / 2 + 50}
					textAnchor="middle"
					fontSize={props.subtitleSize}
					fill={props.subtitleColor}>
					{props.subtitle}
				</Text>
				<Circle
					cx="50%"
					cy="50%"
					r={radio}
					stroke={ColorsApp.secondaryColor}
					fill="transparent"
					strokeWidth="10"
				/>
				<Circle
					cx="50%"
					cy="50%"
					r={radio}
					stroke={ColorsApp.primaryColor}
					strokeWidth="10"
					strokeDasharray={circunferencia}
					fill="transparent"
					strokeDashoffset={progress.toString()}
				/>
			</Svg>
		</View>
	);
};
