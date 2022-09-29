interface Settings {
	/**
	 * Possible choices after user login
	 */
	appointments: { label: string }[];
	/**
	 * How many groups are in a single appointment
	 */
	groupCount: number;
	/**
	 * How many people can be in a single group
	 */
	groupMemberCount: number;
	/**
	 * Validity time of one time passwords in seconds
	 */
	otpValidFor: number;
	/**
	 * How many digits does the user have to enter
	 */
	otpCodeLength: number;
}

// change your default settings here
const settings: Settings = {
	appointments: [{ label: '2022. október 25. 14:20' }, { label: '2022. október 26. 14:20' }, { label: '2022. október 27. 14:20' }],
	groupCount: 8,
	groupMemberCount: 20,
	otpValidFor: 120,
	otpCodeLength: 8
};

export default settings;
export type { Settings };
