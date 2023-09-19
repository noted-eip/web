# Run this command upon cloning the repository or when wanting to
# fetch the latest version of the protorepo.
update-submodules:
	git submodule update --init --remote

solve-uniported-dependencies:
	git submodule update --recursive
