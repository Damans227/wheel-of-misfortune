/* Lets a Game Master upload a custom incidents.json / fellows.json from the
 * browser, without needing to redeploy the site. There's no backend on
 * GitHub Pages, so the uploaded file is validated then stashed in
 * localStorage; wheel.js and teams.js check here first and only fall back
 * to fetching the shipped defaults if nothing's been uploaded. The override
 * lives only in that browser (not shared with other viewers).
 */
var appConfig = (function () {
    var KEYS = {
        incidents: "wom_incidents_override",
        fellows: "wom_fellows_override"
    };

    function get(key) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function clear(key) {
        localStorage.removeItem(key);
    }

    function hasOverride(key) {
        return get(key) !== null;
    }

    function validateIncidents(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return "Must be a JSON array of incidents.";
        }
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (typeof item !== "object" || item === null) {
                return "Incident " + (i + 1) + " is not an object.";
            }
            if (typeof item.title !== "string" || !item.title.trim()) {
                return "Incident " + (i + 1) + " is missing a \"title\" string.";
            }
            if (typeof item.scenario !== "string" || !item.scenario.trim()) {
                return "Incident " + (i + 1) + " is missing a \"scenario\" string.";
            }
        }
        return null;
    }

    function validateFellows(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return "Must be a JSON array of names.";
        }
        for (var i = 0; i < data.length; i++) {
            if (typeof data[i] !== "string" || !data[i].trim()) {
                return "Entry " + (i + 1) + " is not a non-empty string.";
            }
        }
        return null;
    }

    // Mirrors d3.json's callback(error, data) shape so wheel.js/teams.js
    // don't need to change how they consume the result.
    function loadIncidents(callback) {
        var override = get(KEYS.incidents);
        if (override) {
            callback(null, override);
            return;
        }
        d3.json("./incidents/general_incidents.json", callback);
    }

    function loadFellows(callback) {
        var override = get(KEYS.fellows);
        if (override) {
            callback(null, override);
            return;
        }
        d3.json("./fellows.json", callback);
    }

    function handleUpload(fileInput, key, validate, statusEl) {
        var file = fileInput.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var data;
            try {
                data = JSON.parse(e.target.result);
            } catch (err) {
                showError(statusEl, "Not valid JSON: " + err.message);
                fileInput.value = "";
                return;
            }
            var error = validate(data);
            if (error) {
                showError(statusEl, error);
                fileInput.value = "";
                return;
            }
            set(key, data);
            location.reload();
        };
        reader.readAsText(file);
    }

    function showError(statusEl, message) {
        if (!statusEl) {
            return;
        }
        statusEl.textContent = message;
        statusEl.className = "config-status config-error";
    }

    function resetToDefault(key) {
        clear(key);
        location.reload();
    }

    function renderStatus() {
        var pairs = [
            { key: KEYS.incidents, el: "incidents-config-status", label: "incidents" },
            { key: KEYS.fellows, el: "fellows-config-status", label: "fellows" }
        ];
        pairs.forEach(function (pair) {
            var el = document.getElementById(pair.el);
            if (!el) {
                return;
            }
            el.textContent = hasOverride(pair.key)
                ? "Using uploaded " + pair.label
                : "Using default " + pair.label;
            el.className = "config-status " + (hasOverride(pair.key) ? "config-custom" : "config-default");
        });
    }

    document.addEventListener("DOMContentLoaded", renderStatus);

    return {
        KEYS: KEYS,
        loadIncidents: loadIncidents,
        loadFellows: loadFellows,
        handleUpload: handleUpload,
        resetToDefault: resetToDefault,
        validateIncidents: validateIncidents,
        validateFellows: validateFellows
    };
})();
