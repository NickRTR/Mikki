<script>
import { current_component } from "svelte/internal";


	const toBase64 = (file, prg) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
		reader.onprogress = (progress) =>prg((progress.loaded / progress.total) * 100);
	});
</script>

<body>
	<input id="file" type="file" on:change={test} />
</body>