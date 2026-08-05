/* Team builder: pick available Fellows, split them across the four stage
 * teams (Acknowledge, Triage, Mitigate, Resolve), as evenly as possible.
 * Acknowledge absorbs any imbalance first, so it's the team most likely
 * to run a member short. */
var teamBuilder = (function () {
    var STAGES = ["Acknowledge", "Triage", "Mitigate", "Resolve"];
    // remainder members (after the even split) go to these teams first,
    // in this order, before Acknowledge ever gets an extra.
    var REMAINDER_ORDER = ["Triage", "Mitigate", "Resolve"];

    function renderFellowList(fellows) {
        var list = document.getElementById("fellow-list");
        list.innerHTML = "";
        fellows.forEach(function (name, i) {
            var id = "fellow-" + i;
            var li = document.createElement("li");
            li.className = "pv2 ba bl-0 bt-0 br-0 b--dotted b--black-30";
            li.innerHTML =
                '<input type="checkbox" class="magic-checkbox" name="fellow" value="' + name + '" id="' + id + '">' +
                '<label for="' + id + '" title="' + name + '">' + name + "</label>";
            list.appendChild(li);
        });
    }

    function teamSizes(n) {
        var base = Math.floor(n / 4),
            remainder = n % 4,
            sizes = { Acknowledge: base, Triage: base, Mitigate: base, Resolve: base };
        for (var i = 0; i < remainder; i++) {
            sizes[REMAINDER_ORDER[i]] += 1;
        }
        return sizes;
    }

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a;
    }

    function getSelectedFellows() {
        var checked = document.querySelectorAll('#fellow-list input[type="checkbox"]:checked');
        return Array.prototype.map.call(checked, function (cb) { return cb.value; });
    }

    function renderTeams(teams) {
        var container = document.getElementById("team-results-list");
        container.innerHTML = "";
        STAGES.forEach(function (stage) {
            var members = teams[stage];
            var block = document.createElement("div");
            block.className = "mv3 tl";
            var membersHtml = members.length
                ? "<ul>" + members.map(function (m) { return '<li class="pv1">' + m + "</li>"; }).join("") + "</ul>"
                : '<p class="f5 mid-gray">No one assigned</p>';
            block.innerHTML = '<span class="badge-gold">' + stage + "</span>" + membersHtml;
            container.appendChild(block);
        });
    }

    function generate() {
        var selected = getSelectedFellows(),
            sizes = teamSizes(selected.length),
            shuffled = shuffle(selected),
            teams = {},
            idx = 0;
        STAGES.forEach(function (stage) {
            teams[stage] = shuffled.slice(idx, idx + sizes[stage]);
            idx += sizes[stage];
        });
        renderTeams(teams);
        document.getElementById("team-builder-form").style.display = "none";
        document.getElementById("team-results").style.display = "block";
    }

    function showForm() {
        document.getElementById("team-results").style.display = "none";
        document.getElementById("team-builder-form").style.display = "block";
    }

    appConfig.loadFellows(function (error, fellows) {
        if (error) {
            console.error("Could not load fellows.json", error);
            return;
        }
        renderFellowList(fellows);
    });

    return {
        generate: generate,
        showForm: showForm
    };
})();
