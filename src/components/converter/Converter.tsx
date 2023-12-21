import React from "react";
import classes from "./converter.module.css";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import TemporaryDrawer from "../sidebar/SideBar";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
type numberingSystem = 2 | 8 | 10 | 16;

type FormDataType = {
	targetNum: string;
	initialSystem: numberingSystem;
	targetSystem: numberingSystem;
};

type ResType = {
	source: {
		value: string;
		numberingSystem: numberingSystem;
	};
	end: {
		value: string;
		numberingSystem: numberingSystem;
	};
};

export const Converter = () => {
	const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, "children" | "severity"> | null>(null);
	const [error, setError] = React.useState<boolean>(false);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [formData, setFormData] = React.useState<FormDataType>({
		targetNum: "1100",
		initialSystem: 2,
		targetSystem: 10,
	});
	const [result, setResult] = React.useState<ResType>({
		source: {
			value: "1100",
			numberingSystem: 2,
		},
		end: {
			value: "12",
			numberingSystem: 10,
		},
	});

	const handleSet = (value: any, target: "targetNum" | "initialSystem" | "targetSystem") => {
		switch (target) {
			case "targetNum":
				setFormData({ ...formData, targetNum: value.toUpperCase().trim() });
				setError(false);
				break;
			case "initialSystem":
				if (value === 2 || value === 8 || value === 10 || value === 16) setFormData({ ...formData, initialSystem: value });
				break;
			case "targetSystem":
				if (value === 2 || value === 8 || value === 10 || value === 16) setFormData({ ...formData, targetSystem: value });
				break;
		}
	};

	const style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};

	const onSubmit = () => {
		(async () => {
			try {
				const body = {
					number: String(formData.targetNum),
					fromBase: formData.initialSystem,
					toBase: formData.targetSystem,
				};
				const req = await axios.post("http://localhost:5000/", body);
				const data = req.data;
				console.log(data);
				setResult({
					source: {
						value: formData.targetNum,
						numberingSystem: formData.initialSystem,
					},
					end: {
						value: data,
						numberingSystem: formData.targetSystem,
					},
				});
				setSnackbar({ children: "Успех!", severity: "success" });
			} catch (err) {
				console.log(err.response.data.message);
				setSnackbar({ children: `ошибка: ${err.response.data.message}`, severity: "error" });
				setError(true);
			}
		})();
	};
	const handleCloseSnackbar = () => setSnackbar(null);
	return (
		<Container>
			<h1 className={classes.header}>Системы счисления</h1>
			<div className={classes.formWrapper}>
				<h3>Перевести</h3>
				<TextField
					id="outlined-basic"
					error={error}
					helperText={error && "некорректное значение"}
					variant="standard"
					value={formData.targetNum}
					onChange={(e) => handleSet(e.target.value, "targetNum")}
				/>
				<h3>из</h3>
				<TextField
					id="outlined-basic"
					variant="standard"
					select
					value={formData.initialSystem}
					onChange={(e) => handleSet(e.target.value, "initialSystem")}
				>
					<MenuItem value={2}>2</MenuItem>
					<MenuItem value={8}>8</MenuItem>
					<MenuItem value={10}>10</MenuItem>
					<MenuItem value={16}>16</MenuItem>
				</TextField>
				<h3>-ной в</h3>
				<TextField id="outlined-basic" variant="standard" select value={formData.targetSystem} onChange={(e) => handleSet(e.target.value, "targetSystem")}>
					<MenuItem value={2}>2</MenuItem>
					<MenuItem value={8}>8</MenuItem>
					<MenuItem value={10}>10</MenuItem>
					<MenuItem value={16}>16</MenuItem>
				</TextField>
				<h3>ную</h3>
				<Button variant="outlined" onClick={onSubmit}>
					Перевести
				</Button>
			</div>
			<Divider />
			<div className={classes.result}>
				<div className={classes.resultItem}>
					<div className={classes.target}>{result.source.value}</div>
					<div className={classes.systemIndex}>{result.source.numberingSystem}</div>
				</div>
				=
				<div className={classes.resultItem}>
					<div className={classes.target}>{result.end.value}</div>
					<div className={classes.systemIndex}>{result.end.numberingSystem}</div>
				</div>
			</div>
			<TemporaryDrawer handleOpen={handleOpen} />
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Конвертор систем счисления
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						<Typography variant="body1" gutterBottom>
							Разработчиком программы является: студент Бугульминского машиностроительного техникума. Специальность 09.02.07 Малахов Артур группа 046-И.
							Программа предназначена для конвертации значения из одной системы счисления в другую.
						</Typography>
						<Divider />
						<Typography variant="overline" display="block" gutterBottom>
							Мы работаем с действительными числами не длиннее 50-ти символов, в системах счисления с двоичной по шестнадцатиричную, без обеда и
							выходных.
						</Typography>
					</Typography>
				</Box>
			</Modal>
			{!!snackbar && (
				<Snackbar open anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={handleCloseSnackbar} autoHideDuration={6000}>
					<Alert {...snackbar} onClose={handleCloseSnackbar} />
				</Snackbar>
			)}
		</Container>
	);
};
