// src/components/ShowtimeList.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShowtimes } from "../store/slices/showtimeSlice";

function ShowtimeList() {
	const dispatch = useDispatch();

	const {
		items: showtimes,
		status,
		error,
	} = useSelector((state) => state.showtimes);
	// console.log(showtimes[0]);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchShowtimes());
		}
	}, [status, dispatch]);

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (status === "failed") {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			{showtimes.map((showtime) => (
				<div key={showtime._id}>
					<h3>{showtime.screen_name}</h3>
					<p>{showtime.start_time}</p>
				</div>
			))}
		</div>
	);
}

export default ShowtimeList;
